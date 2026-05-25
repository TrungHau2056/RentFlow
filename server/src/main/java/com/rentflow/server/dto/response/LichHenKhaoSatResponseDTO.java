package com.rentflow.server.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichHenKhaoSatResponseDTO {
    private Long id;
    private Long batDongSanId;
    private String diaChiBatDongSan;
    private Long chuNhaId;
    private String tenChuNha;
    private Long nhanVienId;
    private String tenNhanVien;
    private LocalDateTime thoiGian;
    private String trangThai;
    private String ketQuaKhaoSat;
}