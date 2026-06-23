package com.portfolio.repository;

import com.portfolio.entity.StockPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockPriceRepository extends JpaRepository<StockPrice, Long> {

    Optional<StockPrice> findBySymbolAndDate(String symbol, LocalDate date);

    List<StockPrice> findBySymbolAndDateBetweenOrderByDateAsc(String symbol, LocalDate from, LocalDate to);

    // 특정 날짜 이전 가장 최근 거래일 (주말/공휴일 처리)
    Optional<StockPrice> findTopBySymbolAndDateLessThanEqualOrderByDateDesc(String symbol, LocalDate date);

    // 특정 날짜 이후 첫 거래일 (시뮬 시작일 보정)
    Optional<StockPrice> findTopBySymbolAndDateGreaterThanEqualOrderByDateAsc(String symbol, LocalDate date);
}
