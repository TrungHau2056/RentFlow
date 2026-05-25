package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả khảo sát bất động sản")
public class KetQuaKhaoSatRequestDTO {
    @Schema(description = "Kết quả khảo sát", example = "Đạt yêu cầu")
    private String ketQuaKhaoSat;

    @Schema(description = "Đạt yêu cầu?", example = "true")
    private Boolean dat;

    @Schema(description = "Ghi chú", example = "Nhà còn mới, đủ điều kiện cho thuê")
    private String ghiChu;
}