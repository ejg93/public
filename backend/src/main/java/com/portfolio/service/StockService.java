package com.portfolio.service;

import com.portfolio.entity.StockPrice;
import com.portfolio.repository.StockPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final RestTemplate rest;

    public StockService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(30_000);
        this.rest = new RestTemplate(factory);
    }

    @Autowired
    private StockPriceRepository stockPriceRepository;

    private HttpEntity<String> yahooEntity() {
        HttpHeaders h = new HttpHeaders();
        h.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        return new HttpEntity<>(h);
    }

    // ── 종목 검색 ────────────────────────────────────────
    @SuppressWarnings("unchecked")
    public List<Map<String, String>> search(String q) {
        String url = "https://query2.finance.yahoo.com/v1/finance/search?q="
                + q + "&quotesCount=10&newsCount=0";
        try {
            ResponseEntity<Map> resp = rest.exchange(url, HttpMethod.GET, yahooEntity(), Map.class);
            Map<String, Object> body = resp.getBody();
            if (body == null) return List.of();
            List<Map<String, Object>> quotes = (List<Map<String, Object>>) body.get("quotes");
            if (quotes == null) return List.of();
            return quotes.stream()
                    .filter(item -> "EQUITY".equals(item.get("quoteType")))
                    .filter(item -> {
                        String ex = (String) item.get("exchange");
                        return ex != null && List.of("NMS", "NYQ", "NGS", "NAS", "ASE", "PCX").contains(ex);
                    })
                    .map(item -> {
                        Map<String, String> r = new HashMap<>();
                        r.put("symbol", (String) item.get("symbol"));
                        String name = (String) item.getOrDefault("longname", item.getOrDefault("shortname", ""));
                        r.put("name", name);
                        r.put("exchange", (String) item.getOrDefault("exchDisp", ""));
                        return r;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of();
        }
    }

    // ── 데이터 로드: Yahoo → DB ──────────────────────────
    @SuppressWarnings("unchecked")
    public Map<String, Object> loadData(String symbol, String fromStr) {
        LocalDate from = LocalDate.parse(fromStr);
        LocalDate to   = LocalDate.now();

        // DB에 이미 데이터 있으면 Yahoo 호출 스킵
        List<StockPrice> cached = stockPriceRepository
                .findBySymbolAndDateBetweenOrderByDateAsc(symbol, from, to);
        if (!cached.isEmpty()) {
            String firstTradeDate = stockPriceRepository
                    .findTopBySymbolAndDateGreaterThanEqualOrderByDateAsc(symbol, from)
                    .map(sp -> sp.getDate().toString()).orElse(from.toString());
            Map<String, Object> res = new HashMap<>();
            res.put("saved",          0);
            res.put("total",          cached.size());
            res.put("from",           cached.get(0).getDate().toString());
            res.put("to",             cached.get(cached.size() - 1).getDate().toString());
            res.put("firstTradeDate", firstTradeDate);
            res.put("name",           symbol);
            return res;
        }

        long period1 = from.atStartOfDay(ZoneOffset.UTC).toEpochSecond();
        long period2 = to.plusDays(1).atStartOfDay(ZoneOffset.UTC).toEpochSecond();

        String url = "https://query1.finance.yahoo.com/v8/finance/chart/" + symbol
                + "?interval=1d&period1=" + period1 + "&period2=" + period2;

        ResponseEntity<Map> resp = rest.exchange(url, HttpMethod.GET, yahooEntity(), Map.class);
        Map<String, Object> body = resp.getBody();

        Map<String, Object> chart   = (Map<String, Object>) body.get("chart");
        List<Map<String, Object>> results = (List<Map<String, Object>>) chart.get("result");
        Map<String, Object> result  = results.get(0);

        List<Object>             timestamps = (List<Object>)             result.get("timestamp");
        Map<String, Object>      indicators = (Map<String, Object>)      result.get("indicators");
        List<Map<String, Object>> quoteList = (List<Map<String, Object>>) indicators.get("quote");
        Map<String, Object>      q          = quoteList.get(0);

        List<Object> opens   = (List<Object>) q.get("open");
        List<Object> highs   = (List<Object>) q.get("high");
        List<Object> lows    = (List<Object>) q.get("low");
        List<Object> closes  = (List<Object>) q.get("close");
        List<Object> volumes = (List<Object>) q.get("volume");

        // 이미 DB에 있는 날짜 세트 조회 (배치 저장용)
        LocalDate rangeFrom = from;
        LocalDate rangeTo   = to;
        Set<LocalDate> existing = stockPriceRepository
                .findBySymbolAndDateBetweenOrderByDateAsc(symbol, rangeFrom, rangeTo)
                .stream().map(StockPrice::getDate).collect(Collectors.toSet());

        List<StockPrice> toSave = new ArrayList<>();
        for (int i = 0; i < timestamps.size(); i++) {
            if (closes.get(i) == null) continue;
            long ts = ((Number) timestamps.get(i)).longValue();
            LocalDate date = Instant.ofEpochSecond(ts)
                    .atZone(ZoneId.of("America/New_York"))
                    .toLocalDate();
            if (!existing.contains(date)) {
                long vol = volumes.get(i) != null ? ((Number) volumes.get(i)).longValue() : 0L;
                toSave.add(new StockPrice(
                        symbol, date,
                        safeD(opens.get(i)),
                        safeD(highs.get(i)),
                        safeD(lows.get(i)),
                        safeD(closes.get(i)),
                        vol
                ));
            }
        }
        stockPriceRepository.saveAll(toSave);
        int saved = toSave.size();

        Map<String, Object> meta = (Map<String, Object>) result.get("meta");
        String name = (String) meta.getOrDefault("longName", symbol);

        String firstTradeDate = stockPriceRepository
                .findTopBySymbolAndDateGreaterThanEqualOrderByDateAsc(symbol, from)
                .map(sp -> sp.getDate().toString()).orElse(from.toString());

        Map<String, Object> res = new HashMap<>();
        res.put("saved",          saved);
        res.put("total",          timestamps.size());
        res.put("from",           from.toString());
        res.put("to",             to.toString());
        res.put("firstTradeDate", firstTradeDate);
        res.put("name",           name);
        return res;
    }

    // ── 특정 날짜 가격 (없으면 가장 최근 거래일) ─────────
    public Map<String, Object> priceAt(String symbol, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        Optional<StockPrice> sp = stockPriceRepository
                .findTopBySymbolAndDateLessThanEqualOrderByDateDesc(symbol, date);

        Map<String, Object> res = new HashMap<>();
        if (sp.isEmpty()) return res;
        StockPrice p = sp.get();
        res.put("date",   p.getDate().toString());
        res.put("open",   p.getOpen());
        res.put("high",   p.getHigh());
        res.put("low",    p.getLow());
        res.put("close",  p.getClose());
        res.put("volume", p.getVolume());
        return res;
    }

    // ── 차트 데이터 (날짜 범위, OHLCV 풀 반환) ──────────
    public List<Map<String, Object>> chartData(String symbol, String fromStr, String toStr) {
        LocalDate from = LocalDate.parse(fromStr);
        LocalDate to   = LocalDate.parse(toStr);
        return stockPriceRepository
                .findBySymbolAndDateBetweenOrderByDateAsc(symbol, from, to)
                .stream().map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("date",   p.getDate().toString());
                    m.put("open",   p.getOpen());
                    m.put("high",   p.getHigh());
                    m.put("low",    p.getLow());
                    m.put("close",  p.getClose());
                    m.put("volume", p.getVolume());
                    return m;
                }).collect(Collectors.toList());
    }

    private double safeD(Object v) {
        if (v == null) return 0.0;
        return ((Number) v).doubleValue();
    }
}
