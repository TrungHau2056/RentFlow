package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu đăng nhập")
public class LoginRequestDTO {
    @Schema(description = "Email đăng nhập", example = "user@example.com")
    private String email;

    @Schema(description = "Mật khẩu", example = "password123")
    private String password;
}
