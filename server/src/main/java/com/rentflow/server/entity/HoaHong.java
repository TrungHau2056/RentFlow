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
@Table(name = "hoa_hong")
public class HoaHong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hoa_hong")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_hop_dong_thue")
    private HopDongThue hopDongThue;

    @ManyToOne
    @JoinColumn(name = "ma_moi_gioi")
    private MoiGioi moiGioi;

    @Column(name = "ty_le_hoa_hong")
    private Double tyLeHoaHong;

    @Column(name = "gia_tri_hop_dong")
    private Double giaTriHopDong;

    @Column(name = "so_tien_hoa_hong")
    private Double soTienHoaHong;

    @Column(name = "tien_dam_bao_tru")
    private Double tienDamBaoTru;

    @Column(name = "thuc_nhan")
    private Double thucNhan;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_chi")
    private LocalDateTime ngayChi;
}
