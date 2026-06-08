package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo/cập nhật bất động sản")
public class BatDongSanRequestDTO {
    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Địa chỉ", example = "123 Nguyễn Huệ, Quận 1, TP.HCM")
    private String diaChi;

    @Schema(description = "Diện tích (m²)", example = "80.5")
    private Double dienTich;

    @Schema(description = "Giá thuê (VNĐ/tháng)", example = "15000000")
    private Double giaThue;

    @Schema(description = "Mô tả", example = "Căn hộ cao cấp, nội thất đầy đủ")
    private String moTa;
}