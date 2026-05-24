package com.rentflow.server.repository;

import com.rentflow.server.entity.HopDongKyGui;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HopDongKyGuiRepository extends JpaRepository<HopDongKyGui, Long> {

    List<HopDongKyGui> findByTrangThai(String trangThai);

    long countByTrangThai(String trangThai);

    Optional<HopDongKyGui> findByBatDongSanIdAndTrangThai(Long batDongSanId, String trangThai);

    @Query("SELECT h FROM HopDongKyGui h WHERE h.trangThai = :trangThai AND h.ngayBatDau <= :ngayNguong")
    List<HopDongKyGui> findHopDongHetHan(
            @Param("trangThai") String trangThai,
            @Param("ngayNguong") LocalDate ngayNguong
    );
}
