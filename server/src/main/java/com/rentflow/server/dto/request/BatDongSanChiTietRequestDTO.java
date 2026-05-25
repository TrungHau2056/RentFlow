package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatDongSanChiTietRequestDTO {
    private String loaiNha;
    private String huong;
    private Integer soPhongNgu;
    private Integer soPhongVeSinh;
    private Double giaDeXuat;
}