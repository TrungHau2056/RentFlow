package com.rentflow.server.dto.response.taichinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GiaoDichTaiChinhResponseDTO {
    private Long id;
    private String loaiGiaoDich;
    private BigDecimal soTien;
    private LocalDateTime ngayGiaoDich;
    private String trangThai;
    private Long hopDongKyGuiId;
    private Long hopDongThueId;
    private Long nhanVienKeToanId;
    private String nhanVienKeToanHoTen;
}
