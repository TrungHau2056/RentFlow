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
@Table(name = "lich_xem_thuc_dia")
public class LichXemThucDia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lich_xem")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @ManyToOne
    @JoinColumn(name = "ma_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "ma_moi_gioi")
    private MoiGioi moiGioi;

    @Column(name = "thoi_gian_hen")
    private LocalDateTime thoiGianHen;

    @Column(name = "trang_thai_lich")
    private String trangThaiLich;

    @Column(name = "ghi_chu_khach_hang", columnDefinition = "TEXT")
    private String ghiChuKhachHang;
}