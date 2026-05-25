package com.rentflow.server.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChuNhaResponseDTO {
    private Long id;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String cccd;
    private String diaChi;
    private Long taiKhoanId;
}