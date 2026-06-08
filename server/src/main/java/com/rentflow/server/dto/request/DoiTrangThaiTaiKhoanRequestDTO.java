package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu đổi trạng thái tài khoản")
public class DoiTrangThaiTaiKhoanRequestDTO {
    @NotBlank(message = "Trạng thái không được để trống")
    @Schema(description = "Trạng thái mới (KICH_HOAT, KHOA)", example = "KICH_HOAT")
    private String trangThai;
}
