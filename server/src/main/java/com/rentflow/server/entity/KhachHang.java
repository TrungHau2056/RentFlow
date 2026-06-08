package com.rentflow.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "khach_hang")
public class KhachHang {
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

    @Column(name = "nhu_cau_thue", columnDefinition = "TEXT")
    private String nhuCauThue;

    @Column(name = "tieu_chi_tim_nha", columnDefinition = "TEXT")
    private String tieuChiTimNha;

    @Column(name = "nhu_cau_thue_chi_tiet", columnDefinition = "TEXT")
    private String nhuCauThueChiTiet;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_moi_gioi_id")
    @JsonIgnore
    private NhanVien nhanVienMoiGioi;

    @OneToMany(mappedBy = "khachHang")
    private Set<LichHenXemNha> lichHenXemNhaSet = new HashSet<>();

    @OneToMany(mappedBy = "khachHang")
    private Set<HopDongThue> hopDongThueSet = new HashSet<>();
}
