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
    List<LichHenXemNha> findByNhanVienId(Long nhanVienId);
    List<LichHenXemNha> findByKhachHangId(Long khachHangId);
    List<LichHenXemNha> findByBatDongSanId(Long batDongSanId);
    List<LichHenXemNha> findByTrangThai(String trangThai);
    List<LichHenXemNha> findByNhanVienIdAndTrangThai(Long nhanVienId, String trangThai);
    List<LichHenXemNha> findByKhachHangIdAndTrangThai(Long khachHangId, String trangThai);
}
