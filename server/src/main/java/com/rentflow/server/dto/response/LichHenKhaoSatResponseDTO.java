package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin lịch hẹn khảo sát")
public class LichHenKhaoSatResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String diaChiBatDongSan;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Tên chủ nhà", example = "Nguyễn Văn A")
    private String tenChuNha;

    @Schema(description = "ID nhân viên khảo sát", example = "1")
    private Long nhanVienId;

    @Schema(description = "Tên nhân viên", example = "Lê Thị C")
    private String tenNhanVien;

    @Schema(description = "Thời gian khảo sát", example = "2026-06-08T14:00:00")
    private LocalDateTime thoiGian;

    @Schema(description = "Trạng thái", example = "LEN_LICH")
    private String trangThai;

    @Schema(description = "Kết quả khảo sát", example = "Đạt yêu cầu")
    private String ketQuaKhaoSat;
}