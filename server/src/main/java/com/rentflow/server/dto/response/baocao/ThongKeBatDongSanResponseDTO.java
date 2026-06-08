package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thống kê bất động sản")
public class ThongKeBatDongSanResponseDTO {
    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;

    @Schema(description = "Số nhà đang ký gửi", example = "10")
    private long soNhaDangKyGui;

    @Schema(description = "Số nhà đã cho thuê", example = "5")
    private long soNhaDaChoThue;

    @Schema(description = "Số hợp đồng sắp hết hạn", example = "2")
    private long soHopDongSapHetHan;

    @Schema(description = "Tổng số bất động sản", example = "50")
    private long tongSoBatDongSan;

    @Schema(description = "Số nhà đã bán", example = "5")
    private long soNhaDaBan;

    @Schema(description = "Số nhà còn trống", example = "10")
    private long soNhaConTrong;

    @Schema(description = "Thống kê theo khu vực")
    private List<ThongKeKhuVucDTO> thongKeKhuVuc;

    @Schema(description = "Thống kê theo loại hình")
    private List<ThongKeLoaiHinhDTO> thongKeLoaiHinh;
}
