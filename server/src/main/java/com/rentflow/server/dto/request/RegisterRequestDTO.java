package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu đăng ký tài khoản")
public class RegisterRequestDTO {
    @NotBlank
    @Schema(description = "Họ và tên", example = "Nguyễn Văn A")
    private String hoTen;

    @NotBlank
    @Email
    @Schema(description = "Email", example = "user@example.com")
    private String email;

    @NotBlank
    @Schema(description = "Mật khẩu", example = "password123")
    private String password;

    @Schema(description = "Số điện thoại", example = "0912345678")
    private String soDienThoai;

    @Schema(description = "Nhu cầu thuê", example = "Cần thuê căn hộ 2 phòng ngủ")
    private String nhuCauThue;

    @Schema(description = "Vai trò (CHU_NHA hoặc KHACH_THUE)", example = "CHU_NHA")
    private String vaiTro;
}