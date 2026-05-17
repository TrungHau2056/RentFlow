package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("KE_TOAN")
public class KeToan extends NguoiDung {
    @Column(name = "ngay_vao_lam")
    private LocalDateTime ngayVaoLam;

    @OneToMany(mappedBy = "keToan")
    private Set<HoaHong> hoaHongs;

    @OneToMany(mappedBy = "keToan")
    private Set<TienDamBao> tienDamBaos;
}
