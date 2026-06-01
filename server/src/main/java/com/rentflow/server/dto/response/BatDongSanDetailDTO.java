package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Chi tiết đầy đủ bất động sản")
public class BatDongSanDetailDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Tên chủ nhà", example = "Nguyễn Văn A")
    private String tenChuNha;

    @Schema(description = "Địa chỉ", example = "123 Nguyễn Huệ, Quận 1")
    private String diaChi;

    @Schema(description = "Diện tích (m²)", example = "80.5")
    private Double dienTich;

    @Schema(description = "Giá thuê (VNĐ/tháng)", example = "15000000")
    private Double giaThue;

    @Schema(description = "Giá đề xuất (VNĐ)", example = "15000000")
    private Double giaDeXuat;

    @Schema(description = "Loại nhà", example = "Căn hộ")
    private String loaiNha;

    @Schema(description = "Hướng", example = "Đông Nam")
    private String huong;

    @Schema(description = "Số phòng ngủ", example = "2")
    private Integer soPhongNgu;

    @Schema(description = "Số phòng vệ sinh", example = "2")
    private Integer soPhongVeSinh;

    @Schema(description = "Mô tả", example = "Căn hộ cao cấp, nội thất đầy đủ")
    private String moTa;

    @Schema(description = "Trạng thái", example = "CHO_THUE")
    private String trangThai;

    @Schema(description = "Ngày tạo", example = "2026-01-15T10:30:00")
    private LocalDateTime ngayTao;
}