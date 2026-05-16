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
@DiscriminatorValue("CHU_NHA")
public class ChuNha extends NguoiDung {
    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "cccd_cmnd")
    private String cccdCmnd;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
