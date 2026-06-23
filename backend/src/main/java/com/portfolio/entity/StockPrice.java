package com.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_price",
       uniqueConstraints = @UniqueConstraint(columnNames = {"symbol", "date"}))
@Getter @Setter @NoArgsConstructor
public class StockPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String symbol;

    @Column(nullable = false)
    private LocalDate date;

    private Double open;
    private Double high;
    private Double low;
    private Double close;
    private Long volume;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public StockPrice(String symbol, LocalDate date,
                      Double open, Double high, Double low, Double close, Long volume) {
        this.symbol    = symbol;
        this.date      = date;
        this.open      = open;
        this.high      = high;
        this.low       = low;
        this.close     = close;
        this.volume    = volume;
        this.createdAt = LocalDateTime.now();
    }
}
