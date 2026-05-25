package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo tài khoản nhân viên")
public class TaoNhanVienRequestDTO {
    @NotBlank(message = "Username không được để trống")
    @Schema(description = "Tên đăng nhập", example = "nhanvien01")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Schema(description = "Mật khẩu", example = "password123")
    private String password;

    @NotBlank(message = "Vai trò không được để trống")
    @Schema(description = "Vai trò (NHAN_VIEN_DAI_LY, KE_TOAN, BO_PHAN_PHAP_LUAT)", example = "NHAN_VIEN_DAI_LY")
    private String tenVaiTro;

    @NotBlank(message = "Họ tên không được để trống")
    @Schema(description = "Họ và tên", example = "Nguyễn Văn A")
    private String hoTen;

    @NotBlank(message = "Email không được để trống")
    @Schema(description = "Email", example = "nhanvien@example.com")
    private String email;

    @Schema(description = "Số điện thoại", example = "0912345678")
    private String soDienThoai;
}
