package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Yêu cầu ghi nhận thu tiền đảm bảo")
public class GhiNhanThuRequestDTO {

    @NotNull(message = "hopDongKyGuiId không được để trống")
    @Schema(description = "ID hợp đồng ký gửi", example = "1")
    private Long hopDongKyGuiId;
}
