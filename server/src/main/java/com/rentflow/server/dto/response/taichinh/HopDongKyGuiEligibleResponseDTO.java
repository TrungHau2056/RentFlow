package com.rentflow.server.dto.response.taichinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HopDongKyGuiEligibleResponseDTO {
    private Long hopDongKyGuiId;
    private Long chuNhaId;
    private String chuNhaHoTen;
    private Long batDongSanId;
    private String batDongSanDiaChi;
    private LocalDate ngayBatDau;
    private long soThangDaQua;
    private BigDecimal tienDamBaoChuaChi;
}
