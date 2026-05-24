package com.rentflow.server.repository;

import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiaoDichTaiChinhRepository extends JpaRepository<GiaoDichTaiChinh, Long> {
    List<GiaoDichTaiChinh> findByNhanVienKeToan(NhanVien nhanVien);

    boolean existsByHopDongKyGuiIdAndLoaiGiaoDich(Long hopDongKyGuiId, String loaiGiaoDich);

    boolean existsByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
            Long hopDongKyGuiId, String loaiGiaoDich, String trangThai);

    List<GiaoDichTaiChinh> findByLoaiGiaoDich(String loaiGiaoDich);

    List<GiaoDichTaiChinh> findByHopDongKyGuiId(Long hopDongKyGuiId);

    List<GiaoDichTaiChinh> findByHopDongThueId(Long hopDongThueId);
}
