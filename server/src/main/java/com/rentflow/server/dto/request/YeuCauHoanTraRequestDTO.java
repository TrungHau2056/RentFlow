package com.rentflow.server.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class YeuCauHoanTraRequestDTO {

    @NotNull(message = "hopDongKyGuiId không được để trống")
    private Long hopDongKyGuiId;

    @NotBlank(message = "Lý do chấm dứt không được để trống")
    private String lyDoChAmDut;
}
