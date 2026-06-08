package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Báo cáo hợp đồng")
public class BaoCaoHopDongResponseDTO {
    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;

    @Schema(description = "Tổng hợp đồng ký gửi", example = "10")
    private long tongHopDongKyGui;

    @Schema(description = "Hợp đồng ký gửi còn hiệu lực", example = "7")
    private long hopDongKyGuiConHieuLuc;

    @Schema(description = "Hợp đồng ký gửi hết hạn", example = "3")
    private long hopDongKyGuiHetHan;

    @Schema(description = "Tổng hợp đồng thuê", example = "15")
    private long tongHopDongThue;

    @Schema(description = "Hợp đồng thuê mới", example = "5")
    private long hopDongThueMoi;

    @Schema(description = "Hợp đồng thuê đang hoạt động", example = "8")
    private long hopDongThueDangHoatDong;

    @Schema(description = "Hợp đồng thuê kết thúc", example = "2")
    private long hopDongThueKetThuc;
}
