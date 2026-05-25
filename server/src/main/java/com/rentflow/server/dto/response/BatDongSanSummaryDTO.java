package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tóm tắt bất động sản (công khai)")
public class BatDongSanSummaryDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "Địa chỉ", example = "123 Nguyễn Huệ, Quận 1")
    private String diaChi;

    @Schema(description = "Diện tích (m²)", example = "80.5")
    private Double dienTich;

    @Schema(description = "Giá thuê (VNĐ/tháng)", example = "15000000")
    private Double giaThue;

    @Schema(description = "Loại nhà", example = "Căn hộ")
    private String loaiNha;

    @Schema(description = "Hướng", example = "Đông Nam")
    private String huong;

    @Schema(description = "Trạng thái", example = "CHO_THUE")
    private String trangThai;
}