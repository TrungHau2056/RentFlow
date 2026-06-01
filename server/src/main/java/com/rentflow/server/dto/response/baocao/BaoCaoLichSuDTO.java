package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Lịch sử báo cáo đã lưu")
public class BaoCaoLichSuDTO {
    @Schema(description = "ID báo cáo", example = "1")
    private Long id;

    @Schema(description = "Loại báo cáo", example = "TỔNG_HỢP")
    private String loaiBaoCao;

    @Schema(description = "Nội dung báo cáo", example = "{}")
    private String noiDung;

    @Schema(description = "Ngày tạo", example = "2026-06-01T10:30:00")
    private LocalDateTime ngayTao;

    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;
}
