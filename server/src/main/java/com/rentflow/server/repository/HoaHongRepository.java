package com.rentflow.server.repository;

import com.rentflow.server.entity.HoaHong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaHongRepository extends JpaRepository<HoaHong, Long> {

    boolean existsByHopDongThueId(Long hopDongThueId);

    Optional<HoaHong> findByHopDongThueId(Long hopDongThueId);

    List<HoaHong> findByNhanVienMoiGioiId(Long nhanVienMoiGioiId);

    @Query("SELECT COALESCE(SUM(h.soTien), 0) FROM HoaHong h WHERE MONTH(h.ngayTinh) = :thang AND YEAR(h.ngayTinh) = :nam")
    BigDecimal sumHoaHongByThangNam(@Param("thang") int thang, @Param("nam") int nam);

    @Query("""
        SELECT COALESCE(SUM(h.soTien), 0) FROM HoaHong h
        WHERE MONTH(h.ngayTinh) = :thang AND YEAR(h.ngayTinh) = :nam
        AND h.trangThaiThanhToan = :trangThai
        """)
    BigDecimal sumHoaHongByThangNamAndTrangThai(
        @Param("thang") int thang,
        @Param("nam") int nam,
        @Param("trangThai") String trangThai
    );

    @Query("SELECT COUNT(h) FROM HoaHong h WHERE MONTH(h.ngayTinh) = :thang AND YEAR(h.ngayTinh) = :nam")
    long countByThangNam(@Param("thang") int thang, @Param("nam") int nam);

    @Query("""
        SELECT COALESCE(SUM(h.soTien), 0) FROM HoaHong h
        WHERE h.nhanVienMoiGioi.id = :nhanVienId
        AND MONTH(h.ngayTinh) = :thang AND YEAR(h.ngayTinh) = :nam
        """)
    BigDecimal sumHoaHongByMoiGioiAndThangNam(
        @Param("nhanVienId") Long nhanVienId,
        @Param("thang") int thang,
        @Param("nam") int nam
    );

    @Query("""
        SELECT COALESCE(SUM(h.soTien), 0) FROM HoaHong h
        WHERE h.nhanVienMoiGioi.id = :nhanVienId
        AND MONTH(h.ngayTinh) = :thang AND YEAR(h.ngayTinh) = :nam
        AND h.trangThaiThanhToan = :trangThai
        """)
    BigDecimal sumHoaHongByMoiGioiAndThangNamAndTrangThai(
        @Param("nhanVienId") Long nhanVienId,
        @Param("thang") int thang,
        @Param("nam") int nam,
        @Param("trangThai") String trangThai
    );
}
