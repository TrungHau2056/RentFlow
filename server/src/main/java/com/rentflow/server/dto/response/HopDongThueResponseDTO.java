package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hợp đồng thuê")
public class HopDongThueResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID khách hàng", example = "1")
    private Long khachHangId;

    @Schema(description = "Tên khách hàng", example = "Trần Văn B")
    private String tenKhachHang;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String diaChiBatDongSan;

    @Schema(description = "ID nhân viên môi giới", example = "1")
    private Long nhanVienMoiGioiId;

    @Schema(description = "Tên nhân viên môi giới", example = "Lê Thị C")
    private String tenNhanVienMoiGioi;

    @Schema(description = "Ngày ký", example = "2026-06-15")
    private LocalDate ngayKy;

    @Schema(description = "Ngày bắt đầu", example = "2026-07-01")
    private LocalDate ngayBatDau;

    @Schema(description = "Ngày kết thúc", example = "2027-06-30")
    private LocalDate ngayKetThuc;

    @Schema(description = "Tiền thuê (VNĐ/tháng)", example = "10000000")
    private BigDecimal tienThue;

    @Schema(description = "Tiền cọc (VNĐ)", example = "10000000")
    private BigDecimal tienCoc;

    @Schema(description = "Trạng thái", example = "NHAP")
    private String trangThai;
}