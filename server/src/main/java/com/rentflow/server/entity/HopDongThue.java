package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hop_dong_thue")
public class HopDongThue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "khach_hang_id")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "bat_dong_san_id")
    private BatDongSan batDongSan;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_moi_gioi_id")
    private NhanVien nhanVienMoiGioi;

    @Column(name = "ngay_ky")
    private LocalDate ngayKy;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "tien_thue")
    private BigDecimal tienThue;

    @Column(name = "tien_coc")
    private BigDecimal tienCoc;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "hopDongThue")
    private Set<HoaHong> hoaHongSet = new HashSet<>();

    @OneToMany(mappedBy = "hopDongThue")
    private Set<GiaoDichTaiChinh> giaoDichTaiChinhSet = new HashSet<>();
}
