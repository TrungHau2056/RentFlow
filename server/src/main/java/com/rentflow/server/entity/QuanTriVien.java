package com.rentflow.server.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Builder
@Setter
@Getter
@NoArgsConstructor
@Entity
@DiscriminatorValue("QUAN_TRI_VIEN")
public class QuanTriVien extends NguoiDung {
}
