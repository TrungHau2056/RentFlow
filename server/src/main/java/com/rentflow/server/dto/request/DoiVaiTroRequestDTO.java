package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoiVaiTroRequestDTO {
    @NotBlank(message = "Vai trò không được để trống")
    private String tenVaiTro;
}
