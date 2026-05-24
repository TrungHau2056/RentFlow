package com.rentflow.server.dto.response.baocao;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeBatDongSanResponseDTO {
    private int thang;
    private int nam;
    private long soNhaDangKyGui;
    private long soNhaDaChoThue;
    private long soHopDongSapHetHan;
}
