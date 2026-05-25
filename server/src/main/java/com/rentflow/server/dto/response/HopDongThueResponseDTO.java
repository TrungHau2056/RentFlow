package com.rentflow.server.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HopDongThueResponseDTO {
    private Long id;
    private Long khachHangId;
    private String tenKhachHang;
    private Long batDongSanId;
    private String diaChiBatDongSan;
    private Long nhanVienMoiGioiId;
    private String tenNhanVienMoiGioi;
    private LocalDate ngayKy;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal tienThue;
    private BigDecimal tienCoc;
    private String trangThai;
}