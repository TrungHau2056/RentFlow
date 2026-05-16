package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Table(name = "nguoi_dung")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "loai_nguoi_dung", discriminatorType = DiscriminatorType.STRING)
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nguoi_dung")
    private Long id;

    @Column(name = "ho_ten")
    private String hoTen;

    private String email;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "mat_khau_ma_hoa")
    private String matKhauMaHoa;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;

    @ManyToMany
    @JoinTable(
            name = "phan_quyen_nguoi_dung",
            joinColumns = @JoinColumn(name = "ma_nguoi_dung"),
            inverseJoinColumns = @JoinColumn(name = "ma_vai_tro")
    )
    private Set<VaiTro> vaiTros;
}
