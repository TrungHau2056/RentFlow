package com.rentflow.server.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LichHenKhaoSatRequestDTO {
    private Long batDongSanId;
    private Long chuNhaId;
    private Long nhanVienId;
    private LocalDateTime thoiGian;
}