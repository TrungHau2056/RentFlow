package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin khách hàng")
public class KhachHangResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "Họ và tên", example = "Trần Văn B")
    private String hoTen;

    @Schema(description = "Số điện thoại", example = "0987654321")
    private String soDienThoai;

    @Schema(description = "Email", example = "khachhang@example.com")
    private String email;

    @Schema(description = "Nhu cầu thuê", example = "Thuê căn hộ")
    private String nhuCauThue;

    @Schema(description = "Tiêu chí tìm nhà", example = "Gần trung tâm")
    private String tieuChiTimNha;

    @Schema(description = "Nhu cầu thuê chi tiết", example = "Căn hộ 2PN, giá dưới 10tr")
    private String nhuCauThueChiTiet;

    @Schema(description = "ID nhân viên môi giới được phân công", example = "1")
    private Long nhanVienMoiGioiId;
}