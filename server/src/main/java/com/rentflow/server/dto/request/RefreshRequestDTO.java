package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu refresh token")
public class RefreshRequestDTO {
    @Schema(description = "Refresh token", example = "eyJhbGciOiJIUzI1NiIs...")
    private String refreshToken;
}
