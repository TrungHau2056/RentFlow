package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bat_dong_san")
public class BatDongSan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chu_nha_id", nullable = false)
    private ChuNha chuNha;

    @Column(name = "dia_chi", nullable = false)
    private String diaChi;

    @Column(name = "dien_tich")
    private Double dienTich;

    @Column(name = "gia_thue")
    private Double giaThue;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToMany(mappedBy = "batDongSan")
    private Set<HopDongKyGui> hopDongKyGuiSet = new HashSet<>();

    @OneToMany(mappedBy = "batDongSan")
    private Set<LichHenKhaoSat> lichHenKhaoSatSet = new HashSet<>();

    @OneToMany(mappedBy = "batDongSan")
    private Set<LichHenXemNha> lichHenXemNhaSet = new HashSet<>();

    @OneToMany(mappedBy = "batDongSan")
    private Set<HopDongThue> hopDongThueSet = new HashSet<>();
}
