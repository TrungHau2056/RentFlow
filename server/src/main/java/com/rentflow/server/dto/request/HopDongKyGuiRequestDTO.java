package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo/cập nhật hợp đồng ký gửi")
public class HopDongKyGuiRequestDTO {
    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "ID nhân viên phụ trách", example = "1")
    private Long nhanVienId;

    @Schema(description = "Ngày bắt đầu", example = "2026-06-01")
    private LocalDate ngayBatDau;

    @Schema(description = "Ngày kết thúc", example = "2026-12-31")
    private LocalDate ngayKetThuc;

    @Schema(description = "Tiền đảm bảo (VNĐ)", example = "1000000")
    private BigDecimal tienDamBao;
}