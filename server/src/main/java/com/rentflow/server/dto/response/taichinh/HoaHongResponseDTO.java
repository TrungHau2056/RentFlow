package com.rentflow.server.dto.response.taichinh;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hoa hồng môi giới")
public class HoaHongResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID hợp đồng thuê", example = "1")
    private Long hopDongThueId;

    @Schema(description = "ID nhân viên môi giới", example = "1")
    private Long nhanVienMoiGioiId;

    @Schema(description = "Họ tên nhân viên môi giới", example = "Lê Thị C")
    private String nhanVienMoiGioiHoTen;

    @Schema(description = "Số tiền hợp đồng (VNĐ)", example = "10000000")
    private BigDecimal soTienHopDong;

    @Schema(description = "Tỷ lệ hoa hồng", example = "0.05")
    private BigDecimal tyLeHoaHong;

    @Schema(description = "Số tiền hoa hồng (VNĐ)", example = "500000")
    private BigDecimal soTienHoaHong;

    @Schema(description = "Số tiền khấu trừ (VNĐ)", example = "0")
    private BigDecimal soTienKhauTru;

    @Schema(description = "Số tiền thực nhận (VNĐ)", example = "500000")
    private BigDecimal soTienThucNhan;

    @Schema(description = "Ngày tính hoa hồng", example = "2026-07-01")
    private LocalDate ngayTinh;

    @Schema(description = "Ngày thanh toán", example = "2026-07-01T10:00:00")
    private LocalDateTime ngayThanhToan;

    @Schema(description = "Trạng thái thanh toán", example = "CHUA_THANH_TOAN")
    private String trangThaiThanhToan;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String batDongSanDiaChi;

    @Schema(description = "Họ tên khách thuê", example = "Nguyễn Văn A")
    private String khachHangHoTen;

    @Schema(description = "Họ tên chủ nhà", example = "Trần Thị B")
    private String chuNhaHoTen;

    @Schema(description = "Họ tên nhân viên thanh toán", example = "Lê Thị C")
    private String nhanVienThanhToanHoTen;
}
