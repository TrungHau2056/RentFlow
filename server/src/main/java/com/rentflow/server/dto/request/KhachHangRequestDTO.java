package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangRequestDTO {
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String nhuCauThue;
    private String tieuChiTimNha;
    private String nhuCauThueChiTiet;
}