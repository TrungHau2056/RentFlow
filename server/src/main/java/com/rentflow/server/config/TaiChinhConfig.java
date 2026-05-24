package com.rentflow.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@ConfigurationProperties(prefix = "rentflow.tai-chinh")
@Getter
@Setter
public class TaiChinhConfig {
    private BigDecimal tienDamBao;
    private double tyLeHoaHong;
    private int thoiHanKyGuiThang;
}
