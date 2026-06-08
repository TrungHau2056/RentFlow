package com.rentflow.server.dto.response.taichinh;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Hợp đồng thuê đủ điều kiện tính hoa hồng")
public class HopDongThueEligibleResponseDTO {
    private Long hopDongThueId;
    private Long batDongSanId;
    private String batDongSanDiaChi;
    private String khachHangHoTen;
    private String chuNhaHoTen;
    private Long nhanVienMoiGioiId;
    private String nhanVienMoiGioiHoTen;
    private BigDecimal tienThueThang;
    private LocalDate ngayKy;
}
