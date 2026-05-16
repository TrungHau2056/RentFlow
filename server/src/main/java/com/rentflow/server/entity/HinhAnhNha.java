package com.rentflow.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hinh_anh_nha")
public class HinhAnhNha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hinh_anh")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nha")
    private NhaKyGui nhaKyGui;

    @Column(name = "duong_dan_anh")
    private String duongDanAnh;

    @Column(name = "anh_dai_dien")
    private Boolean anhDaiDien;
}
