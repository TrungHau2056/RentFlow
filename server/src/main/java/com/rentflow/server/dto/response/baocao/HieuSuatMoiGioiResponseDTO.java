package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Hiệu suất nhân viên môi giới")
public class HieuSuatMoiGioiResponseDTO {
    @Schema(description = "ID nhân viên", example = "1")
    private Long nhanVienId;

    @Schema(description = "Họ tên", example = "Lê Thị C")
    private String hoTen;

    @Schema(description = "Email", example = "levan@example.com")
    private String email;

    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;

    @Schema(description = "Số hợp đồng đã chốt", example = "3")
    private long soHopDongDaChot;

    @Schema(description = "Tổng hoa hồng nhận (VNĐ)", example = "3000000")
    private BigDecimal tongHoaHongNhan;

    @Schema(description = "Tổng đã thanh toán (VNĐ)", example = "2000000")
    private BigDecimal tongDaThanhToan;

    @Schema(description = "Số giao dịch thực hiện", example = "5")
    private long soGiaoDichThucHien;

    @Schema(description = "Tỷ lệ chốt (%)", example = "60.0")
    private double tyLeChot;

    @Schema(description = "Xếp hạng", example = "1")
    private int hang;
}
