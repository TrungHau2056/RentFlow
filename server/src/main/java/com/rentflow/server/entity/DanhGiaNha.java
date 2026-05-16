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
@Table(name = "danh_gia_nha")
public class DanhGiaNha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_gia")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @ManyToOne
    @JoinColumn(name = "ma_nhan_vien_dai_ly")
    private NhanVienDaiLy nhanVienDaiLy;

    @Column(name = "ngay_tiep_nhan")
    private LocalDateTime ngayTiepNhan;

    @Column(name = "ngay_lien_he")
    private LocalDateTime ngayLienHe;

    @Column(name = "ket_qua_lien_he")
    private String ketQuaLienHe;

    @Column(name = "ngay_hen_gap")
    private LocalDateTime ngayHenGap;

    @Column(name = "ket_qua_danh_gia")
    private String ketQuaDanhGia;

    @Column(name = "nhan_xet")
    private String nhanXet;

    @Column(name = "hinh_anh_thuc_te")
    private String hinhAnhThucTe;

    @Column(name = "ngay_danh_gia")
    private LocalDateTime ngayDanhGia;
}
