package com.rentflow.server.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HopDongKyGuiResponseDTO {
    private Long id;
    private Long chuNhaId;
    private String tenChuNha;
    private Long batDongSanId;
    private String diaChiBatDongSan;
    private Long nhanVienId;
    private String tenNhanVien;
    private LocalDate ngayKy;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private BigDecimal tienDamBao;
    private String trangThai;
}