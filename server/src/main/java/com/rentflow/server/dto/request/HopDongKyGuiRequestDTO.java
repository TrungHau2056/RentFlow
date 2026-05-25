package com.rentflow.server.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HopDongKyGuiRequestDTO {
    private Long batDongSanId;
    private Long chuNhaId;
    private Long nhanVienId;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal tienDamBao;
}