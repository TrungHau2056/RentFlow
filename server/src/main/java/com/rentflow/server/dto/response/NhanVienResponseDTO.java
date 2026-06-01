package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin nhân viên")
public class NhanVienResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "Họ và tên", example = "Nguyễn Văn A")
    private String hoTen;

    @Schema(description = "Email", example = "nhanvien@example.com")
    private String email;

    @Schema(description = "Số điện thoại", example = "0900000001")
    private String soDienThoai;

    @Schema(description = "Chức vụ", example = "MOI_GIOI")
    private String chucVu;
}
