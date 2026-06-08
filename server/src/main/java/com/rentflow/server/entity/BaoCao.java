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
@Table(name = "bao_cao")
public class BaoCao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_admin_id")
    private NhanVien nhanVienAdmin;

    @Column(name = "loai_bao_cao")
    private String loaiBaoCao;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "thang")
    private int thang;

    @Column(name = "nam")
    private int nam;
}
