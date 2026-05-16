package com.rentflow.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;


@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("NHAN_VIEN_DAI_LY")
public class NhanVienDaiLy extends NguoiDung {
    @Column(name = "chuc_vu")
    private String chucVu;
}
