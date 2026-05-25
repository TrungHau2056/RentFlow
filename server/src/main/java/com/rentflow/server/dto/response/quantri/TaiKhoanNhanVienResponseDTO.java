package com.rentflow.server.dto.response.quantri;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin tài khoản nhân viên")
public class TaiKhoanNhanVienResponseDTO {
    @Schema(description = "ID tài khoản", example = "1")
    private Long id;

    @Schema(description = "Tên đăng nhập", example = "nhanvien01")
    private String username;

    @Schema(description = "Trạng thái", example = "KICH_HOAT")
    private String trangThai;

    @Schema(description = "Vai trò", example = "NHAN_VIEN_DAI_LY")
    private String tenVaiTro;

    @Schema(description = "ID nhân viên", example = "1")
    private Long nhanVienId;

    @Schema(description = "Họ tên", example = "Nguyễn Văn A")
    private String hoTen;

    @Schema(description = "Email", example = "nhanvien@example.com")
    private String email;

    @Schema(description = "Số điện thoại", example = "0912345678")
    private String soDienThoai;

    @Schema(description = "Chức vụ", example = "Nhân viên môi giới")
    private String chucVu;
}
