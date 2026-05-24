package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "giao_dich_tai_chinh")
public class GiaoDichTaiChinh {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_ke_toan_id")
    private NhanVien nhanVienKeToan;

    @ManyToOne
    @JoinColumn(name = "hop_dong_ky_gui_id")
    private HopDongKyGui hopDongKyGui;

    @ManyToOne
    @JoinColumn(name = "hop_dong_thue_id")
    private HopDongThue hopDongThue;

    @Column(name = "loai_giao_dich")
    private String loaiGiaoDich;

    @Column(name = "so_tien")
    private BigDecimal soTien;

    @Column(name = "ngay_giao_dich")
    private LocalDateTime ngayGiaoDich;

    @Column(name = "trang_thai")
    private String trangThai;
}
