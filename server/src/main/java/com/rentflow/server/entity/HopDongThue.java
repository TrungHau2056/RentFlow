package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @Column(name = "ma_hop_dong_thue")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @ManyToOne
    @JoinColumn(name = "ma_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "ma_chu_nha")
    private ChuNha chuNha;

    @ManyToOne
    @JoinColumn(name = "ma_moi_gioi")
    private MoiGioi moiGioi;

    @Column(name = "gia_thue")
    private Double giaThue;

    @Column(name = "ngay_bat_dau")
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @Column(name = "dieu_khoan", columnDefinition = "TEXT")
    private String dieuKhoan;

    @Column(name = "ngay_ky")
    private LocalDateTime ngayKy;

    @Column(name = "trang_thai")
    private String trangThai;
}