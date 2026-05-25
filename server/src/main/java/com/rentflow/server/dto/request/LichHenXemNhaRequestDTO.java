package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichHenXemNhaRequestDTO {
    @NotNull
    private Long khachHangId;

    @NotNull
    private Long batDongSanId;

    private Long nhanVienId;

    @NotNull
    private LocalDateTime thoiGian;

    private String trangThai;

    private String phanHoi;

    private String noiDungTraoDoi;

    private String ketQua;
}