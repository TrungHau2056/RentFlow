package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo lịch hẹn khảo sát")
public class LichHenKhaoSatRequestDTO {
    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "ID nhân viên khảo sát", example = "1")
    private Long nhanVienId;

    @Schema(description = "Thời gian khảo sát", example = "2026-06-08T14:00:00")
    private LocalDateTime thoiGian;
}