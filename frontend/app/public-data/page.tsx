'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { SPRING } from '@/lib/api'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any
  }
}

type Job = {
  id: string
  url: string
  company: string
  title: string
  location: string
  lat: number | null
  lng: number | null
  distance: number | null
  salary: string
  salaryMin: number
  expMin: number
  expName: string
  education: string
  jobType: string
  repeatCount: number
}

type SortKey = 'distance' | 'salary' | 'exp'

const USER_LAT = 37.5966
const USER_LNG = 127.0869

export default function JobRadar() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('distance')
  const mapRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)
  const mapInited = useRef(false)

  useEffect(() => {
    fetch(`${SPRING}/api/jobs`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        setJobs(data.jobs ?? [])
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  function initMap(jobList: Job[]) {
    if (!mapRef.current || !window.kakao || mapInited.current) return
    mapInited.current = true
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(USER_LAT, USER_LNG),
        level: 8,
      })

      // 내 위치 마커
      const userMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(USER_LAT, USER_LNG),
        map,
      })
      const userIw = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:6px 8px;font-size:12px;font-weight:bold">📍 내 위치</div>',
      })
      window.kakao.maps.event.addListener(userMarker, 'click', () => userIw.open(map, userMarker))

      // 구인 마커
      jobList.forEach(job => {
        if (job.lat == null || job.lng == null) return
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(job.lat, job.lng),
          map,
        })
        const iw = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 8px;font-size:12px;min-width:140px"><b>${job.company}</b><br><span style="color:#666">${job.title}</span><br><small>${job.distance != null ? job.distance + 'km' : ''}</small></div>`,
        })
        window.kakao.maps.event.addListener(marker, 'click', () => iw.open(map, marker))
      })
    })
  }

  // script 로드 완료 콜백
  function onScriptLoad() {
    scriptLoaded.current = true
    if (!loading) initMap(jobs)
  }

  // jobs 로드 완료 시
  useEffect(() => {
    if (!loading && scriptLoaded.current) initMap(jobs)
  }, [loading, jobs]) // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = [...jobs].sort((a, b) => {
    if (sort === 'distance') return (a.distance ?? 999) - (b.distance ?? 999)
    if (sort === 'salary') return b.salaryMin - a.salaryMin
    return a.expMin - b.expMin
  })

  return (
    <div style={{ paddingTop: '60px', maxWidth: '760px' }}>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
        onLoad={onScriptLoad}
      />

      <div className="mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '4px', marginBottom: '16px' }}>
        EXPERIMENT_03
      </div>
      <h1 className="display" style={{ fontSize: '60px', lineHeight: 1, marginBottom: '8px' }}>
        <span style={{ color: 'var(--accent)' }}>JOB</span><br />
        <span style={{ color: 'var(--text)' }}>RADAR</span>
      </h1>
      <p className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '32px', lineHeight: 2 }}>
        사람인 IT 구인 · 서울<br />
        기준 위치: 서울시 중랑구 동일로 143길
      </p>

      {/* 정렬 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['distance', 'salary', 'exp'] as SortKey[]).map(k => (
          <button
            key={k}
            onClick={() => setSort(k)}
            style={{
              padding: '6px 16px',
              background: sort === k ? 'var(--accent)' : 'var(--surface2)',
              color: sort === k ? '#000' : 'var(--muted)',
              border: '1px solid ' + (sort === k ? 'var(--accent)' : 'var(--border)'),
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '1px',
              fontWeight: sort === k ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {k === 'distance' ? '거리순' : k === 'salary' ? '급여순' : '경력순'}
          </button>
        ))}
        {!loading && !error && (
          <span className="mono" style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)', alignSelf: 'center' }}>
            {jobs.length}건
          </span>
        )}
      </div>

      {/* 지도 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '360px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          marginBottom: '24px',
          background: 'var(--surface2)',
        }}
      />

      {/* 상태 */}
      {loading && (
        <div className="mono" style={{ color: 'var(--muted)', fontSize: '12px', padding: '24px 0' }}>
          ◌ 구인 정보 로딩 중...
        </div>
      )}
      {error && (
        <div
          className="mono"
          style={{
            fontSize: '12px',
            color: 'var(--accent2, #ff6b6b)',
            padding: '16px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            marginBottom: '16px',
            lineHeight: 1.8,
          }}
        >
          {error.includes('SARAMIN_ACCESS_KEY')
            ? 'SARAMIN_ACCESS_KEY 미설정\n→ .env.local에 키 추가 후 재시작'
            : `ERROR: ${error}`}
        </div>
      )}

      {/* 카드 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map(job => (
          <div
            key={job.id}
            style={{
              padding: '18px 20px',
              background: 'var(--surface2)',
              border: `1px solid ${job.repeatCount >= 2 ? 'rgba(255,180,0,0.3)' : 'var(--border)'}`,
              borderRadius: '8px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = job.repeatCount >= 2 ? 'rgba(255,180,0,0.7)' : 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = job.repeatCount >= 2 ? 'rgba(255,180,0,0.3)' : 'var(--border)')}
          >
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14px' }}>{job.company}</span>
                {job.repeatCount >= 2 && (
                  <span className="mono" style={{
                    fontSize: '10px', color: '#ffb400',
                    background: 'rgba(255,180,0,0.1)',
                    border: '1px solid rgba(255,180,0,0.3)',
                    padding: '1px 7px', borderRadius: '4px',
                  }}>
                    ⚠ 반복공고 {job.repeatCount}건
                  </span>
                )}
              </div>
              {job.distance != null && (
                <span className="mono" style={{
                  fontSize: '11px', color: 'var(--accent)',
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.2)',
                  padding: '2px 8px', borderRadius: '4px',
                  flexShrink: 0, marginLeft: '12px',
                }}>
                  {job.distance}km
                </span>
              )}
            </div>

            {/* 직무 */}
            <a href={job.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--muted)', fontSize: '13px', display: 'block', marginBottom: '12px', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {job.title} →
            </a>

            {/* 메타 */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {job.location && (
                <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>📍 {job.location}</span>
              )}
              <span className="mono" style={{ fontSize: '11px', color: 'var(--accent3, #a78bfa)' }}>💰 {job.salary}</span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>📋 {job.expName}</span>
              {job.jobType && (
                <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>{job.jobType}</span>
              )}
            </div>

            {/* 회사 조사 링크 */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { label: '잡플래닛', url: `https://www.jobplanet.co.kr/companies?q=${encodeURIComponent(job.company)}`, color: '#4f9cf9' },
                { label: '크레딧잡', url: `https://www.creditjob.co.kr/search?keyword=${encodeURIComponent(job.company)}`, color: '#a78bfa' },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="mono"
                  style={{
                    fontSize: '10px', color: link.color,
                    background: 'var(--surface)',
                    border: `1px solid ${link.color}33`,
                    padding: '3px 10px', borderRadius: '4px',
                    textDecoration: 'none', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${link.color}15`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
