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
@Table(name = "nha_ky_gui")
public class NhaKyGui {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nha")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_chu_nha")
    private ChuNha chuNha;

    @Column(name = "loai_nha")
    private String loaiNha;

    @Column(name = "dien_tich")
    private Double dienTich;

    @Column(name = "huong_nha")
    private String huongNha;

    @Column(name = "so_phong_ngu")
    private Integer soPhongNgu;

    @Column(name = "so_phong_khach")
    private Integer soPhongKhach;

    @Column(name = "so_wc")
    private Integer soWc;

    @Column(name = "thanh_pho")
    private String thanhPho;

    @Column(name = "quan_huyen")
    private String quanHuyen;

    @Column(name = "phuong_xa")
    private String phuongXa;

    private String duong;

    @Column(name = "so_nha")
    private String soNha;

    @Column(name = "gia_de_xuat")
    private Double giaDeXuat;

    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_dang_ky")
    private LocalDateTime ngayDangKy;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}