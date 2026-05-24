package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoiTrangThaiTaiKhoanRequestDTO {
    @NotBlank(message = "Trạng thái không được để trống")
    private String trangThai;
}
