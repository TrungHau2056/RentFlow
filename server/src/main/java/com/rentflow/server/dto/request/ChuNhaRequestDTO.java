package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo/cập nhật chủ nhà")
public class ChuNhaRequestDTO {
    @Schema(description = "Họ và tên", example = "Nguyễn Văn A")
    private String hoTen;

    @Schema(description = "Số điện thoại", example = "0912345678")
    private String soDienThoai;

    @Schema(description = "Email", example = "chunha@example.com")
    private String email;

    @Schema(description = "CCCD/CMND", example = "079201000123")
    private String cccd;

    @Schema(description = "Địa chỉ", example = "456 Lê Lợi, Quận 1, TP.HCM")
    private String diaChi;

    @Schema(description = "ID tài khoản (để liên kết)", example = "1")
    private Long taiKhoanId;
}