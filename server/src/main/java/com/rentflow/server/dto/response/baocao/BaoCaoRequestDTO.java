package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request lưu báo cáo")
public class BaoCaoRequestDTO {
    @Schema(description = "Loại báo cáo", example = "TONG_HOP")
    private String loaiBaoCao;

    @Schema(description = "Nội dung báo cáo (JSON)", example = "{}")
    private String noiDung;

    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Năm", example = "2026")
    private int nam;
}
