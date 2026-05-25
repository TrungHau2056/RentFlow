package com.rentflow.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu phê duyệt hợp đồng ký gửi")
public class PheDuyetRequestDTO {
    @Schema(description = "Duyệt hay từ chối?", example = "true")
    private boolean duyet;

    @Schema(description = "Lý do từ chối (nếu từ chối)", example = "Hợp đồng thiếu điều khoản")
    private String lyDoTuChoi;

    @Schema(description = "Ghi chú thêm", example = "Đã kiểm tra và xác nhận")
    private String ghiChu;
}