package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hop_dong_thue_id")
    private HopDongThue hopDongThue;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_moi_gioi_id")
    private NhanVien nhanVienMoiGioi;

    @Column(name = "so_tien")
    private BigDecimal soTien;

    @Column(name = "ngay_tinh")
    private LocalDate ngayTinh;

    @Column(name = "trang_thai_thanh_toan")
    private String trangThaiThanhToan;
}
