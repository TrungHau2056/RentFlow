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
@Table(name = "hop_dong_ky_gui")
public class HopDongKyGui {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chu_nha_id")
    private ChuNha chuNha;

    @ManyToOne
    @JoinColumn(name = "bat_dong_san_id")
    private BatDongSan batDongSan;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @Column(name = "ngay_ky")
    private LocalDate ngayKy;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "tien_dam_bao")
    private BigDecimal tienDamBao;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "hopDongKyGui")
    private Set<GiaoDichTaiChinh> giaoDichTaiChinhSet = new HashSet<>();
}
