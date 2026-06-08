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
@Schema(description = "Hợp đồng ký gửi đủ điều kiện hoàn trả")
public class HopDongKyGuiEligibleResponseDTO {
    @Schema(description = "ID hợp đồng ký gửi", example = "1")
    private Long hopDongKyGuiId;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Họ tên chủ nhà", example = "Nguyễn Văn A")
    private String chuNhaHoTen;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String batDongSanDiaChi;

    @Schema(description = "Ngày bắt đầu ký gửi", example = "2025-12-01")
    private LocalDate ngayBatDau;

    @Schema(description = "Số tháng đã qua", example = "6")
    private long soThangDaQua;

    @Schema(description = "Tiền đảm bảo chưa chi (VNĐ)", example = "1000000")
    private BigDecimal tienDamBaoChuaChi;
}
