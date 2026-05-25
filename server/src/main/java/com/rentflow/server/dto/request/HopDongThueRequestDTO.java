package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo/cập nhật hợp đồng thuê")
public class HopDongThueRequestDTO {
    @NotNull
    @Schema(description = "ID khách hàng", example = "1")
    private Long khachHangId;

    @NotNull
    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @NotNull
    @Schema(description = "ID nhân viên môi giới", example = "1")
    private Long nhanVienMoiGioiId;

    @Schema(description = "Ngày ký hợp đồng", example = "2026-06-15")
    private LocalDate ngayKy;

    @NotNull
    @Schema(description = "Ngày bắt đầu thuê", example = "2026-07-01")
    private LocalDate ngayBatDau;

    @NotNull
    @Schema(description = "Ngày kết thúc thuê", example = "2027-06-30")
    private LocalDate ngayKetThuc;

    @NotNull
    @Schema(description = "Tiền thuê (VNĐ/tháng)", example = "10000000")
    private BigDecimal tienThue;

    @Schema(description = "Tiền cọc (VNĐ)", example = "10000000")
    private BigDecimal tienCoc;

    @Schema(description = "Trạng thái", example = "NHAP")
    private String trangThai;
}