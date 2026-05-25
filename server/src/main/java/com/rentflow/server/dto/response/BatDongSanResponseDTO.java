package com.rentflow.server.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatDongSanResponseDTO {
    private Long id;
    private Long chuNhaId;
    private String tenChuNha;
    private String diaChi;
    private Double dienTich;
    private Double giaThue;
    private String moTa;
    private String trangThai;
}