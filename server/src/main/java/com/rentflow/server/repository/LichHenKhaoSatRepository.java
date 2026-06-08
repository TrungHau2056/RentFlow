package com.rentflow.server.repository;

import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.LichHenKhaoSat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichHenKhaoSatRepository extends JpaRepository<LichHenKhaoSat, Long> {
    List<LichHenKhaoSat> findByBatDongSan(BatDongSan batDongSan);
    List<LichHenKhaoSat> findByChuNha(ChuNha chuNha);
}
