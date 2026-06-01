package com.rentflow.server.dto.response.baocao;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Hoa hồng theo nhân viên")
public class HoaHongNhanVienDTO {
    @Schema(description = "ID nhân viên", example = "1")
    private Long nhanVienId;

    @Schema(description = "Họ tên", example = "Nguyễn Văn A")
    private String hoTen;

    @Schema(description = "Số tiền hoa hồng (VNĐ)", example = "5000000")
    private BigDecimal soTienHoaHong;

    @Schema(description = "Số hợp đồng", example = "3")
    private long soHopDong;
}
