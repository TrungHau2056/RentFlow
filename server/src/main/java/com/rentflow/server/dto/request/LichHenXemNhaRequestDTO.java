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
@Schema(description = "Yêu cầu tạo/cập nhật lịch hẹn xem nhà")
public class LichHenXemNhaRequestDTO {
    @NotNull
    @Schema(description = "ID khách hàng", example = "1")
    private Long khachHangId;

    @NotNull
    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "ID nhân viên phụ trách", example = "1")
    private Long nhanVienId;

    @NotNull
    @Schema(description = "Thời gian hẹn", example = "2026-06-10T09:00:00")
    private LocalDateTime thoiGian;

    @Schema(description = "Trạng thái", example = "LEN_LICH")
    private String trangThai;

    @Schema(description = "Phản hồi", example = "Khách hàng hài lòng")
    private String phanHoi;

    @Schema(description = "Nội dung trao đổi", example = "Đã giới thiệu căn hộ và dẫn đi xem")
    private String noiDungTraoDoi;

    @Schema(description = "Kết quả", example = "DAT_HEN")
    private String ketQua;
}