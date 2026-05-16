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
@Table(name = "lich_su_lam_viec")
public class LichSuLamViec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lich_su")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "ma_moi_gioi")
    private MoiGioi moiGioi;

    @Column(name = "ngay_gio_tiep_xuc")
    private LocalDateTime ngayGioTiepXuc;

    @Column(name = "hinh_thuc")
    private String hinhThuc;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ket_qua")
    private String ketQua;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
