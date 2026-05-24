package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshRequestDTO {
    private String refreshToken;
}
