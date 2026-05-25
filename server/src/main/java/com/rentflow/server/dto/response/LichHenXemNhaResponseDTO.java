package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin lịch hẹn xem nhà")
public class LichHenXemNhaResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID khách hàng", example = "1")
    private Long khachHangId;

    @Schema(description = "Tên khách hàng", example = "Trần Văn B")
    private String tenKhachHang;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String diaChiBatDongSan;

    @Schema(description = "ID nhân viên", example = "1")
    private Long nhanVienId;

    @Schema(description = "Tên nhân viên", example = "Lê Thị C")
    private String tenNhanVien;

    @Schema(description = "Thời gian hẹn", example = "2026-06-10T09:00:00")
    private LocalDateTime thoiGian;

    @Schema(description = "Trạng thái", example = "LEN_LICH")
    private String trangThai;

    @Schema(description = "Phản hồi", example = "Khách hài lòng")
    private String phanHoi;

    @Schema(description = "Nội dung trao đổi", example = "Đã dẫn khách đi xem nhà")
    private String noiDungTraoDoi;

    @Schema(description = "Kết quả", example = "DAT_HEN")
    private String ketQua;
}