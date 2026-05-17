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
@Table(name = "tien_dam_bao")
public class TienDamBao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_dam_bao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_hop_dong")
    private HopDongKiGui hopDongKiGui;

    @ManyToOne
    @JoinColumn(name = "ma_ke_toan")
    private KeToan keToan;

    @Column(name = "so_tien")
    private Double soTien;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_thu")
    private LocalDateTime ngayThu;

    @Column(name = "ngay_hoan_tra")
    private LocalDateTime ngayHoanTra;

    @Column(name = "ly_do_hoan_tra", columnDefinition = "TEXT")
    private String lyDoHoanTra;
}
