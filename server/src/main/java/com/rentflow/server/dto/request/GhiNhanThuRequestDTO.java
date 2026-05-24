package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GhiNhanThuRequestDTO {

    @NotNull(message = "hopDongKyGuiId không được để trống")
    private Long hopDongKyGuiId;
}
