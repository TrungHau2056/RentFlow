package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thống kê theo khu vực")
public class ThongKeKhuVucDTO {
    @Schema(description = "Khu vực", example = "Quận 1")
    private String khuVuc;

    @Schema(description = "Số lượng", example = "10")
    private long soLuong;
}
