package com.rentflow.server.dto.response.auth;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO implements Serializable {
    private String accessToken;
    private String refreshToken;
}
