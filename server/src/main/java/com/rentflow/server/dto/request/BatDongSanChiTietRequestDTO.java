package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu cập nhật chi tiết bất động sản")
public class BatDongSanChiTietRequestDTO {
    @Schema(description = "Loại nhà", example = "Căn hộ")
    private String loaiNha;

    @Schema(description = "Hướng nhà", example = "Đông Nam")
    private String huong;

    @Schema(description = "Số phòng ngủ", example = "2")
    private Integer soPhongNgu;

    @Schema(description = "Số phòng vệ sinh", example = "2")
    private Integer soPhongVeSinh;

    @Schema(description = "Giá đề xuất (VNĐ)", example = "15000000")
    private Double giaDeXuat;
}