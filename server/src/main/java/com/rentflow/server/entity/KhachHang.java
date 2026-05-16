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
@DiscriminatorValue("KHACH_HANG")
public class KhachHang extends NguoiDung {
    @Column(name = "loai_khach_hang")
    private String loaiKhachHang;

    @ManyToOne
    @JoinColumn(name = "ma_moi_gioi")
    private MoiGioi moiGioi;

    @Column(name = "ngay_dang_ky")
    private LocalDateTime ngayDangKy;

    @Column(name = "ngay_nang_cap")
    private LocalDateTime ngayNangCap;
}
