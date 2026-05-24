package com.rentflow.server.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponseDTO {
    private Long id;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String nhuCauThue;
    private String tieuChiTimNha;
    private String nhuCauThueChiTiet;
}