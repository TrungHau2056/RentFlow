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
@Table(name = "chu_nha")
public class ChuNha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tai_khoan_id")
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "email")
    private String email;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "dia_chi")
    private String diaChi;

    @OneToMany(mappedBy = "chuNha")
    private Set<BatDongSan> batDongSanSet = new HashSet<>();

    @OneToMany(mappedBy = "chuNha")
    private Set<HopDongKyGui> hopDongKyGuiSet = new HashSet<>();

    @OneToMany(mappedBy = "chuNha")
    private Set<LichHenKhaoSat> lichHenKhaoSatSet = new HashSet<>();
}
