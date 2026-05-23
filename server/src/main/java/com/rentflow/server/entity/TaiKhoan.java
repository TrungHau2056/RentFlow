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
@Table(name = "tai_khoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "trang_thai")
    private String trangThai;

    @ManyToOne
    @JoinColumn(name = "vai_tro_id")
    private VaiTro vaiTro;

    @OneToMany(mappedBy = "taiKhoan")
    private Set<ChuNha> chuNhaSet = new HashSet<>();

    @OneToMany(mappedBy = "taiKhoan")
    private Set<KhachHang> khachHangSet = new HashSet<>();

    @OneToMany(mappedBy = "taiKhoan")
    private Set<NhanVien> nhanVienSet = new HashSet<>();
}
