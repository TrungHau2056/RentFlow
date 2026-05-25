package com.rentflow.server.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichHenXemNhaResponseDTO {
    private Long id;
    private Long khachHangId;
    private String tenKhachHang;
    private Long batDongSanId;
    private String diaChiBatDongSan;
    private Long nhanVienId;
    private String tenNhanVien;
    private LocalDateTime thoiGian;
    private String trangThai;
    private String phanHoi;
    private String noiDungTraoDoi;
    private String ketQua;
}