package com.rentflow.server.repository;

import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HopDongKyGuiRepository extends JpaRepository<HopDongKyGui, Long> {
    List<HopDongKyGui> findByChuNha(ChuNha chuNha);
    List<HopDongKyGui> findByNhanVien(NhanVien nhanVien);
    List<HopDongKyGui> findByTrangThai(String trangThai);
}