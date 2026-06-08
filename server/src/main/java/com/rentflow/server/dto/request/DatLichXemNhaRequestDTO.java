package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu khách hàng đặt lịch xem nhà")
public class DatLichXemNhaRequestDTO {

    @NotNull
    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @NotNull
    @Schema(description = "Thời gian hẹn", example = "2026-06-10T09:00:00")
    private LocalDateTime thoiGian;

    @Schema(description = "ID môi giới phụ trách", example = "1")
    private Long nhanVienId;

    @Schema(description = "Ghi chú cho môi giới", example = "Tôi muốn xem phòng ngủ hướng Nam")
    private String ghiChu;

    @Schema(description = "Hình thức xem nhà", example = "truc_tiep")
    private String hinhThucXem;
}
