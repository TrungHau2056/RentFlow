package com.rentflow.server.dto.response.baocao;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HieuSuatMoiGioiResponseDTO {
    private Long nhanVienId;
    private String hoTen;
    private String email;
    private int thang;
    private int nam;
    private long soHopDongDaChot;
    private BigDecimal tongHoaHongNhan;
    private BigDecimal tongDaThanhToan;
}
