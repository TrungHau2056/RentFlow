package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo/cập nhật khách hàng")
public class KhachHangRequestDTO {
    @Schema(description = "Họ và tên", example = "Trần Văn B")
    private String hoTen;

    @Schema(description = "Số điện thoại", example = "0987654321")
    private String soDienThoai;

    @Schema(description = "Email", example = "khachhang@example.com")
    private String email;

    @Schema(description = "Nhu cầu thuê", example = "Thuê căn hộ")
    private String nhuCauThue;

    @Schema(description = "Tiêu chí tìm nhà", example = "Gần trung tâm, an ninh tốt")
    private String tieuChiTimNha;

    @Schema(description = "Nhu cầu thuê chi tiết", example = "Căn hộ 2PN, 1WC, giá dưới 10tr")
    private String nhuCauThueChiTiet;
}