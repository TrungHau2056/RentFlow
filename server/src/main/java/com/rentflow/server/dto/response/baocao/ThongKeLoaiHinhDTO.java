package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thống kê theo loại hình")
public class ThongKeLoaiHinhDTO {
    @Schema(description = "Loại hình", example = "Căn hộ")
    private String loaiHinh;

    @Schema(description = "Số lượng", example = "10")
    private long soLuong;
}
