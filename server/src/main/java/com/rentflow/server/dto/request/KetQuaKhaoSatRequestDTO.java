package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KetQuaKhaoSatRequestDTO {
    private String ketQuaKhaoSat;
    private Boolean dat;
    private String ghiChu;
}