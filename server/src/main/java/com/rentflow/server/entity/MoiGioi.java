package com.rentflow.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("MOI_GIOI")
public class MoiGioi extends NguoiDung {
    @Column(name = "ty_le_hoa_hong")
    private Double tyLeHoaHong;

    @Column(name = "ngay_vao_lam")
    private LocalDateTime ngayVaoLam;
}
