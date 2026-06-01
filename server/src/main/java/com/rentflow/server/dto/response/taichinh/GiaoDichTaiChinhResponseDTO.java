package com.rentflow.server.dto.response.taichinh;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Thông tin giao dịch tài chính")
public class GiaoDichTaiChinhResponseDTO {
    @Schema(description = "ID", example = "1")
    private Long id;

    @Schema(description = "Loại giao dịch", example = "THU_TIEN_DAM_BAO")
    private String loaiGiaoDich;

    @Schema(description = "Số tiền (VNĐ)", example = "1000000")
    private BigDecimal soTien;

    @Schema(description = "Ngày giao dịch", example = "2026-06-01T10:00:00")
    private LocalDateTime ngayGiaoDich;

    @Schema(description = "Trạng thái", example = "HOAN_THANH")
    private String trangThai;

    @Schema(description = "Ghi chú giao dịch")
    private String ghiChu;

    @Schema(description = "Ngày xác nhận", example = "2026-06-01T10:00:00")
    private LocalDateTime ngayXacNhan;

    @Schema(description = "ID người xác nhận", example = "1")
    private Long nguoiXacNhanId;

    @Schema(description = "Họ tên người xác nhận", example = "Nguyễn Văn A")
    private String nguoiXacNhanHoTen;

    @Schema(description = "ID hợp đồng ký gửi", example = "1")
    private Long hopDongKyGuiId;

    @Schema(description = "ID hợp đồng thuê", example = "1")
    private Long hopDongThueId;

    @Schema(description = "ID nhân viên kế toán", example = "1")
    private Long nhanVienKeToanId;

    @Schema(description = "Họ tên nhân viên kế toán", example = "Trần Thị D")
    private String nhanVienKeToanHoTen;

    @Schema(description = "ID bất động sản", example = "1")
    private Long batDongSanId;

    @Schema(description = "Địa chỉ bất động sản", example = "123 Nguyễn Huệ")
    private String batDongSanDiaChi;

    @Schema(description = "ID chủ nhà", example = "1")
    private Long chuNhaId;

    @Schema(description = "Họ tên chủ nhà", example = "Nguyễn Văn A")
    private String chuNhaHoTen;

    @Schema(description = "Họ tên khách thuê", example = "Trần Văn B")
    private String khachHangHoTen;

    @Schema(description = "Họ tên môi giới", example = "Lê Thị C")
    private String moiGioiHoTen;

    @Schema(description = "Tiền đảm bảo trên hợp đồng", example = "1000000")
    private BigDecimal soTienDamBaoHopDong;

    @Schema(description = "Tổng số tiền đã khấu trừ", example = "200000")
    private BigDecimal soTienDaKhauTru;

    @Schema(description = "Số tiền đảm bảo còn lại", example = "800000")
    private BigDecimal soTienConLai;
}
