package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hoa_hong")
public class HoaHong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hop_dong_thue_id")
    private HopDongThue hopDongThue;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_moi_gioi_id")
    private NhanVien nhanVienMoiGioi;

    @Column(name = "so_tien")
    private BigDecimal soTien;

    @Column(name = "ty_le_hoa_hong")
    private BigDecimal tyLeHoaHong;

    @Column(name = "so_tien_khau_tru")
    private BigDecimal soTienKhauTru;

    @Column(name = "so_tien_thuc_nhan")
    private BigDecimal soTienThucNhan;

    @Column(name = "ngay_tinh")
    private LocalDate ngayTinh;

    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_thanh_toan_id")
    private NhanVien nhanVienThanhToan;

    @Column(name = "trang_thai_thanh_toan")
    private String trangThaiThanhToan;
}
