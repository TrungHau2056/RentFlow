package com.rentflow.server.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả đăng nhập/refresh token")
public class JwtResponseDTO implements Serializable {
    @Schema(description = "Access token (JWT)", example = "eyJhbGciOiJIUzI1NiIs...")
    private String accessToken;

    @Schema(description = "Refresh token", example = "eyJhbGciOiJIUzI1NiIs...")
    private String refreshToken;
}
