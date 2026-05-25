package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatDongSanRequestDTO {
    private Long chuNhaId;
    private String diaChi;
    private Double dienTich;
    private Double giaThue;
    private String moTa;
}