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
@Table(name = "hop_dong_ky_gui")
public class HopDongKiGui {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hop_dong_kg")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @ManyToOne
    @JoinColumn(name = "ma_chu_nha")
    private ChuNha chuNha;

    @Column(name = "gia_thoa_thuan")
    private Double giaThoaThuan;

    @Column(name = "phi_moi_gioi_thoa_thuan")
    private Double phiMoiGioiThoaThuan;

    @Column(name = "ngay_bat_dau")
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    @Column(name = "trang_thai")
    private String trangThai;
}