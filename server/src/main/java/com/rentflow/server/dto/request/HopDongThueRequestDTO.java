package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HopDongThueRequestDTO {
    @NotNull
    private Long khachHangId;

    @NotNull
    private Long batDongSanId;

    @NotNull
    private Long nhanVienMoiGioiId;

    private LocalDate ngayKy;

    @NotNull
    private LocalDate ngayBatDau;

    @NotNull
    private LocalDate ngayKetThuc;

    @NotNull
    private BigDecimal tienThue;

    private BigDecimal tienCoc;

    private String trangThai;
}