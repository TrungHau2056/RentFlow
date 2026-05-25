package com.rentflow.server.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatDongSanDetailDTO {
    private Long id;
    private Long chuNhaId;
    private String tenChuNha;
    private String diaChi;
    private Double dienTich;
    private Double giaThue;
    private Double giaDeXuat;
    private String loaiNha;
    private String huong;
    private Integer soPhongNgu;
    private Integer soPhongVeSinh;
    private String moTa;
    private String trangThai;
}