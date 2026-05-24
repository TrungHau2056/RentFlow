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
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tai_khoan_id")
    private TaiKhoan taiKhoan;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "chuc_vu")
    private String chucVu;

    @OneToMany(mappedBy = "nhanVien")
    private Set<HopDongKyGui> hopDongKyGuiSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVien")
    private Set<LichHenKhaoSat> lichHenKhaoSatSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVien")
    private Set<LichHenXemNha> lichHenXemNhaSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVienMoiGioi")
    private Set<HopDongThue> hopDongThueSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVienMoiGioi")
    private Set<HoaHong> hoaHongSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVienAdmin")
    private Set<BaoCao> baoCaoSet = new HashSet<>();

    @OneToMany(mappedBy = "nhanVienKeToan")
    private Set<GiaoDichTaiChinh> giaoDichTaiChinhSet = new HashSet<>();
}
