package com.rentflow.server.repository;

import com.rentflow.server.entity.HopDongThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HopDongThueRepository extends JpaRepository<HopDongThue, Long> {

    boolean existsByBatDongSanIdAndTrangThai(Long batDongSanId, String trangThai);

    List<HopDongThue> findByBatDongSanId(Long batDongSanId);
}
