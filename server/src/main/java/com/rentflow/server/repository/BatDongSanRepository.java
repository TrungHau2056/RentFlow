package com.rentflow.server.repository;

import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatDongSanRepository extends JpaRepository<BatDongSan, Long> {
    List<BatDongSan> findByChuNhaAndTrangThai(ChuNha chuNha, String trangThai);
}
