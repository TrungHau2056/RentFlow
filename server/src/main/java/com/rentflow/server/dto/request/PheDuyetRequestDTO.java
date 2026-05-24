package com.rentflow.server.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PheDuyetRequestDTO {
    private boolean duyet;
    private String lyDoTuChoi;
    private String ghiChu;
}