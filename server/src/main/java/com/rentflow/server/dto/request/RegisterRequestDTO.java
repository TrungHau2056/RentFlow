package com.rentflow.server.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    @NotBlank
    private String hoTen;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String soDienThoai;

    private String nhuCauThue;
}