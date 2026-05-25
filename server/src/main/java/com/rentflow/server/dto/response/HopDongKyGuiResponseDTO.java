package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hợp đồng ký gửi")
public class HopDongKyGuiResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Tên chủ nhà", example = "Nguyễn Văn A")
    private String tenChuNha;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String diaChiBatDongSan;

    @Schema(description = "ID nhân viên phụ trách", example = "1")
    private Long nhanVienId;

    @Schema(description = "Tên nhân viên", example = "Lê Thị C")
    private String tenNhanVien;

    @Schema(description = "Ngày ký", example = "2026-06-01")
    private LocalDate ngayKy;

    @Schema(description = "Ngày bắt đầu", example = "2026-06-01")
    private LocalDate ngayBatDau;

    @Schema(description = "Ngày kết thúc", example = "2026-12-31")
    private LocalDate ngayKetThuc;

    @Schema(description = "Tiền đảm bảo (VNĐ)", example = "1000000")
    private BigDecimal tienDamBao;

    @Schema(description = "Trạng thái", example = "NHAP")
    private String trangThai;
}