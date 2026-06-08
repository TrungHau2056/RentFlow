package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Báo cáo doanh thu hoa hồng")
public class DoanhThuHoaHongResponseDTO {
    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;

    @Schema(description = "Số lượng hợp đồng", example = "5")
    private long soLuongHopDong;

    @Schema(description = "Tổng hoa hồng (VNĐ)", example = "5000000")
    private BigDecimal tongHoaHong;

    @Schema(description = "Tổng đã thanh toán (VNĐ)", example = "3000000")
    private BigDecimal tongDaThanhToan;

    @Schema(description = "Tổng chưa thanh toán (VNĐ)", example = "2000000")
    private BigDecimal tongChuaThanhToan;

    @Schema(description = "Tổng khấu trừ (VNĐ)", example = "0")
    private BigDecimal tongKhauTru;

    @Schema(description = "Doanh thu theo tháng (12 tháng)")
    private List<DoanhThuThangDTO> doanhThuThang;

    @Schema(description = "Doanh thu theo quý (4 quý)")
    private List<DoanhThuQuyDTO> doanhThuQuy;

    @Schema(description = "Hoa hồng theo nhân viên")
    private List<HoaHongNhanVienDTO> hoaHongTheoNhanVien;

    @Schema(description = "Tỷ lệ hoa hồng (%)", example = "15.5")
    private BigDecimal tyLeHoaHong;
}
