package com.rentflow.server.dto.response.baocao;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoanhThuHoaHongResponseDTO {
    private int thang;
    private int nam;
    private long soLuongHopDong;
    private BigDecimal tongHoaHong;
    private BigDecimal tongDaThanhToan;
    private BigDecimal tongChuaThanhToan;
    private BigDecimal tongKhauTru;
}
