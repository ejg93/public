'use client'
import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { SPRING } from '@/lib/api'
const INITIAL_CASH = 10_000_000

type SimStatus = 'idle' | 'loading' | 'ready'
type OrderType = 'BUY' | 'SELL'

type PriceData = { date: string; open: number; high: number; low: number; close: number; volume: number }
type Transaction = { id: string; type: OrderType; date: string; shares: number; price: number; total: number; pnl: number }

type Sim = {
  symbol: string
  name: string
  simStartDate: string
  currentDate: string
  minDate: string
  cash: number
  shares: number
  avgPrice: number
  transactions: Transaction[]
}

function fmtUsd(n: number) { return `$${(n ?? 0).toFixed(2)}` }
function fmtPct(n: number) { const v = n ?? 0; return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` }
function pnlColor(n: number) { return (n ?? 0) >= 0 ? '#00ff88' : '#ff4444' }
function todayStr() { return new Date().toISOString().slice(0, 10) }

function saveSim(sim: Sim | null) {
  try { sim ? localStorage.setItem('time_machine', JSON.stringify(sim)) : localStorage.removeItem('time_machine') } catch {}
}
function loadSim(): Sim | null {
  try { const s = localStorage.getItem('time_machine'); return s ? JSON.parse(s) : null } catch { return null }
}
function savePrices(prices: PriceData[]) {
  try { localStorage.setItem('time_machine_prices', JSON.stringify(prices)) } catch {}
}
function loadPrices(): PriceData[] {
  try { const s = localStorage.getItem('time_machine_prices'); return s ? JSON.parse(s) : [] } catch { return [] }
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontFamily: 'IBM Plex Mono, monospace' }}>
      <div style={{ color: 'var(--muted)', marginBottom: '2px' }}>{label}</div>
      <div style={{ color: 'var(--text)' }}>{fmtUsd(payload[0].value)}</div>
    </div>
  )
}

export default function StockPage() {
  const [status, setStatus] = useState<SimStatus>('idle')
  const [sim, setSim] = useState<Sim | null>(null)

  // 전체 가격 데이터 (로컬 네비용) — API 재호출 없음
  const [allPrices, setAllPrices] = useState<PriceData[]>([])
  const priceMap = useRef<Map<string, PriceData>>(new Map())
  const sortedDates = useRef<string[]>([])

  // search
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ symbol: string; name: string; exchange: string }[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [loadMsg, setLoadMsg] = useState('')

  // order
  const [orderType, setOrderType] = useState<OrderType>('BUY')
  const [orderShares, setOrderShares] = useState('')
  const [orderMsg, setOrderMsg] = useState('')
  const [tab, setTab] = useState<'trade' | 'history'>('trade')

  // 가격 맵 구축
  function buildPriceIndex(prices: PriceData[]) {
    const map = new Map<string, PriceData>()
    prices.forEach(p => map.set(p.date, p))
    priceMap.current = map
    sortedDates.current = prices.map(p => p.date)
  }

  // 날짜 → 가장 가까운 거래일 (이하)
  function nearestPrice(date: string): PriceData | null {
    const dates = sortedDates.current
    if (!dates.length) return null
    let lo = 0, hi = dates.length - 1, idx = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (dates[mid] <= date) { idx = mid; lo = mid + 1 } else hi = mid - 1
    }
    return idx >= 0 ? priceMap.current.get(dates[idx]) ?? null : null
  }

  // currentDate 기준 차트 슬라이스
  function chartSlice(sim: Sim): PriceData[] {
    return allPrices.filter(p => p.date >= sim.simStartDate && p.date <= sim.currentDate)
  }

  // 초기 로드
  useEffect(() => {
    const saved = loadSim()
    const savedPrices = loadPrices()
    if (saved && savedPrices.length) {
      buildPriceIndex(savedPrices)
      setAllPrices(savedPrices)
      setSim(saved)
      setStatus('ready')
    }
  }, [])

  // 검색
  useEffect(() => {
    if (!searchQuery.trim() || selectedSymbol) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const r = await fetch(`${SPRING}/api/stock/search?q=${encodeURIComponent(searchQuery)}`)
        if (r.ok) setSearchResults(await r.json())
      } catch {}
      finally { setSearchLoading(false) }
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery, selectedSymbol])

  async function startSimulation() {
    if (!selectedSymbol || !startDate) return
    setStatus('loading'); setLoadMsg('데이터 로딩 중...')
    try {
      // 1. DB 적재
      const lr = await fetch(`${SPRING}/api/stock/load?symbol=${selectedSymbol}&from=${startDate}`)
      if (!lr.ok) throw new Error('로드 실패')
      const loadData = await lr.json()
      const firstDate: string = loadData.firstTradeDate || startDate

      // 2. 전체 데이터 한 번에 fetch
      setLoadMsg('차트 데이터 구성 중...')
      const cr = await fetch(`${SPRING}/api/stock/chart?symbol=${selectedSymbol}&from=${firstDate}&to=${todayStr()}`)
      if (!cr.ok) throw new Error('차트 로드 실패')
      const prices: PriceData[] = await cr.json()

      buildPriceIndex(prices)
      setAllPrices(prices)
      savePrices(prices)

      const newSim: Sim = {
        symbol: selectedSymbol,
        name: selectedName || loadData.name || selectedSymbol,
        simStartDate: firstDate,
        currentDate: firstDate,
        minDate: firstDate,
        cash: INITIAL_CASH,
        shares: 0,
        avgPrice: 0,
        transactions: [],
      }
      setSim(newSim); saveSim(newSim); setStatus('ready')
      setLoadMsg('')
    } catch (e) {
      setLoadMsg(`오류: ${e instanceof Error ? e.message : '알 수 없음'}`)
      setStatus('idle')
    }
  }

  // 날짜 네비: 로컬에서 즉시 처리
  function navigateTo(targetDate: string) {
    if (!sim) return
    const clamped = targetDate < sim.minDate ? sim.minDate : targetDate > todayStr() ? todayStr() : targetDate
    // sortedDates에서 clamped 이하 마지막 날짜 찾기
    const dates = sortedDates.current
    let lo = 0, hi = dates.length - 1, idx = -1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (dates[mid] <= clamped) { idx = mid; lo = mid + 1 } else hi = mid - 1
    }
    if (idx < 0) return
    const actualDate = dates[idx]
    if (actualDate === sim.currentDate) return
    const updated = { ...sim, currentDate: actualDate }
    setSim(updated); saveSim(updated)
    setOrderMsg('')
  }

  function addDaysNav(n: number) {
    if (!sim) return
    const dt = new Date(sim.currentDate); dt.setDate(dt.getDate() + n)
    navigateTo(dt.toISOString().slice(0, 10))
  }
  function addMonthsNav(n: number) {
    if (!sim) return
    const dt = new Date(sim.currentDate); dt.setMonth(dt.getMonth() + n)
    navigateTo(dt.toISOString().slice(0, 10))
  }

  function executeOrder() {
    if (!sim || !orderShares) return
    const cp = nearestPrice(sim.currentDate)
    if (!cp?.close) { setOrderMsg('가격 없음'); return }
    const shares = parseFloat(orderShares)
    if (isNaN(shares) || shares <= 0) { setOrderMsg('수량 확인'); return }
    const price = cp.close
    const total = shares * price

    if (orderType === 'BUY') {
      if (total > sim.cash) { setOrderMsg('잔액 부족'); return }
      const newShares = sim.shares + shares
      const newAvg = sim.shares === 0 ? price : (sim.avgPrice * sim.shares + total) / newShares
      const tx: Transaction = { id: Date.now().toString(), type: 'BUY', date: cp.date, shares, price, total, pnl: 0 }
      const updated = { ...sim, cash: sim.cash - total, shares: newShares, avgPrice: newAvg, transactions: [tx, ...sim.transactions] }
      setSim(updated); saveSim(updated)
      setOrderMsg(`✓ ${shares}주 매수 (${fmtUsd(price)})`)
    } else {
      if (sim.shares < shares) { setOrderMsg('보유량 부족'); return }
      const pnl = (price - sim.avgPrice) * shares
      const tx: Transaction = { id: Date.now().toString(), type: 'SELL', date: cp.date, shares, price, total, pnl }
      const newShares = sim.shares - shares
      const updated = { ...sim, cash: sim.cash + total, shares: newShares, avgPrice: newShares === 0 ? 0 : sim.avgPrice, transactions: [tx, ...sim.transactions] }
      setSim(updated); saveSim(updated)
      setOrderMsg(`✓ ${shares}주 매도 (손익 ${pnl >= 0 ? '+' : ''}${fmtUsd(pnl)})`)
    }
    setOrderShares('')
  }

  function resetSim() {
    setSim(null); saveSim(null)
    setAllPrices([]); priceMap.current.clear(); sortedDates.current = []
    try { localStorage.removeItem('time_machine_prices') } catch {}
    setStatus('idle'); setSelectedSymbol(''); setSelectedName('')
    setSearchQuery(''); setLoadMsg(''); setOrderMsg('')
  }

  const currentPrice = sim ? nearestPrice(sim.currentDate) : null
  const chart = sim ? chartSlice(sim) : []
  const holdingValue = sim ? sim.shares * (currentPrice?.close || 0) : 0
  const totalValue = sim ? sim.cash + holdingValue : INITIAL_CASH
  const totalPnl = totalValue - INITIAL_CASH
  const holdingPnl = sim && currentPrice?.close && sim.avgPrice ? (currentPrice.close - sim.avgPrice) * sim.shares : 0
  const chartColor = chart.length > 1 && chart[chart.length - 1].close >= chart[0].close ? '#00ff88' : '#ff4444'
  const maxDate = sortedDates.current[sortedDates.current.length - 1] || todayStr()

  const panelStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px' }
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
    fontFamily: 'IBM Plex Mono, monospace', fontWeight: active ? 700 : 400,
    background: active ? 'var(--accent2)' : 'transparent',
    color: active ? '#000' : 'var(--muted)',
    border: `1px solid ${active ? 'var(--accent2)' : 'var(--border)'}`,
  })
  const navBtn = (disabled: boolean): React.CSSProperties => ({
    padding: '7px 13px', borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer',
    background: 'var(--surface2)', color: disabled ? 'var(--border)' : 'var(--muted)',
    border: '1px solid var(--border)', fontSize: '12px',
    fontFamily: 'IBM Plex Mono, monospace', opacity: disabled ? 0.4 : 1,
  })

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="mono" style={{ fontSize: '11px', color: 'var(--accent2)', letterSpacing: '4px', marginBottom: '6px' }}>EXPERIMENT_05</div>
          <h1 className="display" style={{ fontSize: '48px', lineHeight: 1 }}>
            <span style={{ color: 'var(--accent2)' }}>TIME</span>
            <span style={{ color: 'var(--text)' }}> MACHINE</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>과거 시점에서 시작하는 주식 시뮬레이션 · Yahoo Finance 데이터</p>
        </div>
        {status === 'ready' && (
          <button onClick={resetSim} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>
            ↺ 초기화
          </button>
        )}
      </div>

      {/* SETUP */}
      {status !== 'ready' && (
        <div style={{ maxWidth: '520px' }}>
          <div style={panelStyle}>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '16px' }}>SETUP</div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>종목 선택</div>
              <div style={{ position: 'relative' }}>
                <input value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSelectedSymbol(''); setSelectedName('') }}
                  placeholder="Apple, AAPL, Tesla..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--surface2)', border: `1px solid ${selectedSymbol ? 'var(--accent2)' : 'var(--border)'}`, color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                {searchLoading && <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--muted)' }}>...</div>}
                {selectedSymbol && <div className="mono" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--accent2)' }}>✓ {selectedSymbol}</div>}
                {searchResults.length > 0 && !selectedSymbol && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0 0 8px 8px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                    {searchResults.slice(0, 6).map((r, i) => (
                      <div key={i} onClick={() => { setSelectedSymbol(r.symbol); setSelectedName(r.name); setSearchQuery(r.name); setSearchResults([]) }}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < searchResults.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div>
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--accent2)', fontSize: '13px', marginRight: '10px' }}>{r.symbol}</span>
                          <span style={{ color: 'var(--text)', fontSize: '13px' }}>{r.name}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{r.exchange}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>시뮬레이션 시작일</div>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                max={todayStr()} min="2000-01-01"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
              />
            </div>
            <button onClick={startSimulation} disabled={!selectedSymbol || status === 'loading'}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', background: !selectedSymbol || status === 'loading' ? 'var(--border)' : 'var(--accent2)', color: '#000', border: 'none', cursor: !selectedSymbol || status === 'loading' ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace' }}>
              {status === 'loading' ? '로딩 중...' : '▶ 시뮬레이션 시작'}
            </button>
            {loadMsg && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', background: loadMsg.startsWith('오류') ? 'rgba(255,68,68,0.08)' : 'rgba(0,255,136,0.08)', color: loadMsg.startsWith('오류') ? '#ff6666' : 'var(--accent)', border: `1px solid ${loadMsg.startsWith('오류') ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.2)'}` }}>
                {loadMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIMULATION */}
      {status === 'ready' && sim && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 타임라인 */}
          <div style={{ ...panelStyle, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>TIME</span>
              {[
                { label: '◀◀ 1년', disabled: sim.currentDate <= sim.minDate, fn: () => addMonthsNav(-12) },
                { label: '◀ 3달', disabled: sim.currentDate <= sim.minDate, fn: () => addMonthsNav(-3) },
                { label: '◀ 1달', disabled: sim.currentDate <= sim.minDate, fn: () => addMonthsNav(-1) },
                { label: '◀ 1주', disabled: sim.currentDate <= sim.minDate, fn: () => addDaysNav(-7) },
              ].map((b, i) => (
                <button key={i} onClick={b.fn} disabled={b.disabled} style={navBtn(b.disabled)}>{b.label}</button>
              ))}

              <div style={{ flex: 1, textAlign: 'center' }}>
                <input type="date" value={sim.currentDate} min={sim.minDate} max={maxDate}
                  onChange={e => navigateTo(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--surface2)', border: '1px solid var(--accent2)', color: 'var(--accent2)', fontSize: '14px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, outline: 'none', colorScheme: 'dark' }}
                />
              </div>

              {[
                { label: '1주 ▶', disabled: sim.currentDate >= maxDate, fn: () => addDaysNav(7) },
                { label: '1달 ▶', disabled: sim.currentDate >= maxDate, fn: () => addMonthsNav(1) },
                { label: '3달 ▶', disabled: sim.currentDate >= maxDate, fn: () => addMonthsNav(3) },
                { label: '1년 ▶▶', disabled: sim.currentDate >= maxDate, fn: () => addMonthsNav(12) },
                { label: '현재 ▶▶', disabled: sim.currentDate >= maxDate, fn: () => navigateTo(maxDate), accent: true },
              ].map((b, i) => (
                <button key={i} onClick={b.fn} disabled={b.disabled}
                  style={{ ...navBtn(b.disabled), ...(b.accent && !b.disabled ? { color: 'var(--accent2)', borderColor: 'var(--accent2)' } : {}) }}>
                  {b.label}
                </button>
              ))}
            </div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px' }}>
              {sim.symbol} · {sim.name} · 시작: {sim.simStartDate}
            </div>
          </div>

          {/* 메인 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

            {/* 차트 */}
            <div style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>{sim.symbol}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>{sim.name}</div>
                </div>
                {currentPrice && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>{fmtUsd(currentPrice.close)}</div>
                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      {[{ label: '시가', v: currentPrice.open }, { label: '고가', v: currentPrice.high, c: '#00ff88' }, { label: '저가', v: currentPrice.low, c: '#ff4444' }].map((item, i) => (
                        <div key={i} style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{item.label}</div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: item.c || 'var(--text)' }}>{fmtUsd(item.v)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {chart.length > 1 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chart} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} domain={['auto', 'auto']} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={chart[0]?.close} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="close" stroke={chartColor} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '13px' }}>날짜를 앞으로 이동하면 차트가 표시됩니다</div>
              )}
            </div>

            {/* 우측 패널 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* 포트폴리오 */}
              <div style={panelStyle}>
                <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>PORTFOLIO</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: '예수금', value: fmtUsd(sim.cash) },
                    { label: '보유가치', value: fmtUsd(holdingValue) },
                    { label: '총평가', value: fmtUsd(totalValue), bold: true },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: 'var(--text)', fontWeight: item.bold ? 700 : 400 }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>총손익</span>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: pnlColor(totalPnl), fontWeight: 700 }}>
                      {totalPnl >= 0 ? '+' : ''}{fmtUsd(totalPnl)} ({fmtPct((totalPnl / INITIAL_CASH) * 100)})
                    </span>
                  </div>
                  {sim.shares > 0 && (
                    <div style={{ padding: '8px 10px', background: 'var(--surface2)', borderRadius: '6px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{sim.shares}주 보유</span>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: pnlColor(holdingPnl) }}>
                          {holdingPnl >= 0 ? '+' : ''}{fmtUsd(holdingPnl)}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>평균단가 {fmtUsd(sim.avgPrice)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 탭 */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setTab('trade')} style={tabBtn(tab === 'trade')}>매매</button>
                <button onClick={() => setTab('history')} style={tabBtn(tab === 'history')}>거래내역</button>
              </div>

              {/* 매매 */}
              {tab === 'trade' && (
                <div style={panelStyle}>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '14px' }}>ORDER</div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                    {(['BUY', 'SELL'] as const).map(t => (
                      <button key={t} onClick={() => { setOrderType(t); setOrderMsg('') }}
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: 'IBM Plex Mono, monospace', background: orderType === t ? (t === 'BUY' ? '#00ff88' : '#ff4444') : 'var(--surface2)', color: orderType === t ? '#000' : 'var(--muted)', border: 'none' }}>
                        {t === 'BUY' ? '매수' : '매도'}
                      </button>
                    ))}
                  </div>
                  {currentPrice ? (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>{currentPrice.date} 종가</div>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', color: 'var(--text)', fontWeight: 700 }}>{fmtUsd(currentPrice.close)}</div>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>수량 (주)</div>
                        <input type="number" value={orderShares} onChange={e => { setOrderShares(e.target.value); setOrderMsg('') }}
                          placeholder="0" min="0" step="1"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', boxSizing: 'border-box', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'IBM Plex Mono, monospace' }}
                        />
                      </div>
                      {orderShares && !isNaN(parseFloat(orderShares)) && (
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', fontFamily: 'IBM Plex Mono, monospace' }}>
                          주문금액: {fmtUsd(parseFloat(orderShares) * currentPrice.close)}
                        </div>
                      )}
                      <button onClick={executeOrder}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: orderType === 'BUY' ? '#00ff88' : '#ff4444', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                        {orderType === 'BUY' ? '매수하기' : '매도하기'}
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', padding: '20px 0' }}>날짜 선택 후 거래 가능</div>
                  )}
                  {orderMsg && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', background: orderMsg.startsWith('✓') ? 'rgba(0,255,136,0.08)' : 'rgba(255,68,68,0.08)', color: orderMsg.startsWith('✓') ? 'var(--accent)' : '#ff6666', border: `1px solid ${orderMsg.startsWith('✓') ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)'}` }}>
                      {orderMsg}
                    </div>
                  )}
                </div>
              )}

              {/* 거래내역 */}
              {tab === 'history' && (
                <div style={panelStyle}>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '12px' }}>HISTORY</div>
                  {sim.transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', padding: '20px 0' }}>거래 없음</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                      {sim.transactions.map(tx => (
                        <div key={tx.id} style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: '6px', borderLeft: `2px solid ${tx.type === 'BUY' ? '#00ff88' : '#ff4444'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: tx.type === 'BUY' ? '#00ff88' : '#ff4444' }}>{tx.type}</span>
                            <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)' }}>{tx.date}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'var(--text)' }}>{tx.shares}주 @ {fmtUsd(tx.price)}</span>
                            {tx.type === 'SELL' && (
                              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: pnlColor(tx.pnl) }}>{tx.pnl >= 0 ? '+' : ''}{fmtUsd(tx.pnl)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
