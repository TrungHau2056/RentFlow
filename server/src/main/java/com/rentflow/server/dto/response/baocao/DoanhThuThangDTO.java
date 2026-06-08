package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Doanh thu theo tháng")
public class DoanhThuThangDTO {
    @Schema(description = "Tháng", example = "6")
    private int thang;

    @Schema(description = "Doanh thu (VNĐ)", example = "50000000")
    private BigDecimal doanhThu;

    @Schema(description = "Hoa hồng (VNĐ)", example = "10000000")
    private BigDecimal hoaHong;
}
