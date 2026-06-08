package com.rentflow.server.repository;

import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    List<GiaoDichTaiChinh> findByTrangThai(String trangThai);

    List<GiaoDichTaiChinh> findByLoaiGiaoDichAndTrangThai(String loaiGiaoDich, String trangThai);

    @Query("""
        SELECT COALESCE(SUM(g.soTien), 0) FROM GiaoDichTaiChinh g
        WHERE g.hopDongKyGui.id = :hopDongKyGuiId
        AND g.loaiGiaoDich = :loaiGiaoDich
        AND g.trangThai = :trangThai
        """)
    BigDecimal sumByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
            @Param("hopDongKyGuiId") Long hopDongKyGuiId,
            @Param("loaiGiaoDich") String loaiGiaoDich,
            @Param("trangThai") String trangThai
    );
}
