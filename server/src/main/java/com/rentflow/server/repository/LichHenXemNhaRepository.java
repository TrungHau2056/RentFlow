package com.rentflow.server.repository;

import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.LichHenXemNha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichHenXemNhaRepository extends JpaRepository<LichHenXemNha, Long> {
    List<LichHenXemNha> findByKhachHangAndBatDongSan(KhachHang khachHang, BatDongSan batDongSan);
}
