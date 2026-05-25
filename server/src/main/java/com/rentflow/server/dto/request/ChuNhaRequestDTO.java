package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChuNhaRequestDTO {
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String cccd;
    private String diaChi;
    private Long taiKhoanId;
}