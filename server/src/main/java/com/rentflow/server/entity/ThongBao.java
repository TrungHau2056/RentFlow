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
@Table(name = "thong_bao")
public class ThongBao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thong_bao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_nhan")
    private NguoiDung nguoiNhan;

    @Column(name = "loai_thong_bao")
    private String loaiThongBao;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "kenh_gui")
    private String kenhGui;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_gui")
    private LocalDateTime ngayGui;
}
