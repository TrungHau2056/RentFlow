package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Doanh thu theo quý")
public class DoanhThuQuyDTO {
    @Schema(description = "Quý", example = "2")
    private int quy;

    @Schema(description = "Doanh thu (VNĐ)", example = "150000000")
    private BigDecimal doanhThu;

    @Schema(description = "Hoa hồng (VNĐ)", example = "30000000")
    private BigDecimal hoaHong;
}
