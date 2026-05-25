package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu đổi vai trò tài khoản")
public class DoiVaiTroRequestDTO {
    @NotBlank(message = "Vai trò không được để trống")
    @Schema(description = "Vai trò mới (NHAN_VIEN_DAI_LY, KE_TOAN, BO_PHAN_PHAP_LUAT)", example = "NHAN_VIEN_DAI_LY")
    private String tenVaiTro;
}
