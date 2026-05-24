package com.rentflow.server.dto.response.taichinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaHongResponseDTO {
    private Long id;
    private Long hopDongThueId;
    private Long nhanVienMoiGioiId;
    private String nhanVienMoiGioiHoTen;
    private BigDecimal soTienHopDong;
    private BigDecimal soTienHoaHong;
    private BigDecimal soTienKhauTru;
    private BigDecimal soTienThucNhan;
    private LocalDate ngayTinh;
    private String trangThaiThanhToan;
}
