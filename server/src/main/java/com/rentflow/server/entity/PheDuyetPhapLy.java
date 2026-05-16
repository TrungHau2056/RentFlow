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
@Table(name = "phe_duyet_phap_ly")
public class PheDuyetPhapLy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_phe_duyet")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @ManyToOne
    @JoinColumn(name = "ma_nhan_vien_kiem_duyet")
    private NhanVienDaiLy nhanVienKiemDuyet;

    @Column(name = "so_hong_so_do")
    private String soHongSoDo;

    @Column(name = "tinh_trang_tranh_chap")
    private String tinhTrangTranhChap;

    @Column(name = "ket_qua_phe_duyet")
    private String ketQuaPheDuyet;

    @Column(name = "ngay_kiem_duyet")
    private LocalDateTime ngayKiemDuyet;
}
