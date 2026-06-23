package com.portfolio.controller;

import com.portfolio.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/search")
    public List<Map<String, String>> search(@RequestParam String q) {
        return stockService.search(q);
    }

    // 시뮬레이션 시작 전 Yahoo → DB 로드
    @GetMapping("/load")
    public Map<String, Object> load(@RequestParam String symbol, @RequestParam String from) {
        return stockService.loadData(symbol, from);
    }

    // 특정 날짜 가격 (주말/공휴일이면 직전 거래일)
    @GetMapping("/price")
    public Map<String, Object> price(@RequestParam String symbol, @RequestParam String date) {
        return stockService.priceAt(symbol, date);
    }

    // 날짜 범위 차트 데이터
    @GetMapping("/chart")
    public List<Map<String, Object>> chart(
            @RequestParam String symbol,
            @RequestParam String from,
            @RequestParam String to) {
        return stockService.chartData(symbol, from, to);
    }
}
