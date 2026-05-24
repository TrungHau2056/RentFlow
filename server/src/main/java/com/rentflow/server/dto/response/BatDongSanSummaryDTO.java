package com.rentflow.server.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatDongSanSummaryDTO {
    private Long id;
    private String diaChi;
    private Double dienTich;
    private Double giaThue;
    private String loaiNha;
    private String huong;
    private String trangThai;
}