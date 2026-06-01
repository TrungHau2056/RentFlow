package com.rentflow.server.repository;

import com.rentflow.server.entity.HopDongThue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HopDongThueRepository extends JpaRepository<HopDongThue, Long> {

    boolean existsByBatDongSanIdAndTrangThai(Long batDongSanId, String trangThai);

    List<HopDongThue> findByBatDongSanId(Long batDongSanId);

    List<HopDongThue> findByTrangThai(String trangThai);

    List<HopDongThue> findByKhachHangId(Long khachHangId);

    List<HopDongThue> findByTrangThaiAndKhachHangId(String trangThai, Long khachHangId);

    List<HopDongThue> findByNhanVienMoiGioiId(Long nhanVienId);

    long countByNhanVienMoiGioiId(Long nhanVienId);

    List<HopDongThue> findByKhachHangTaiKhoanId(Long taiKhoanId);

    @Query("""
        SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END FROM HopDongThue h
        WHERE h.batDongSan.id = :batDongSanId
        AND h.trangThai IN :trangThaiList
        AND (h.ngayKetThuc IS NULL OR h.ngayKetThuc >= :today)
        """)
    boolean existsActiveByBatDongSan(
        @Param("batDongSanId") Long batDongSanId,
        @Param("trangThaiList") List<String> trangThaiList,
        @Param("today") LocalDate today
    );

    @Query("""
        SELECT COUNT(h) FROM HopDongThue h
        WHERE h.ngayKetThuc BETWEEN :tuNgay AND :denNgay
        """)
    long countHopDongSapHetHan(
        @Param("tuNgay") LocalDate tuNgay,
        @Param("denNgay") LocalDate denNgay
    );

    @Query("""
        SELECT COUNT(h) FROM HopDongThue h
        WHERE h.nhanVienMoiGioi.id = :nhanVienId
        AND MONTH(h.ngayKy) = :thang
        AND YEAR(h.ngayKy) = :nam
        """)
    long countByMoiGioiAndThangNam(
        @Param("nhanVienId") Long nhanVienId,
        @Param("thang") int thang,
        @Param("nam") int nam
    );

    @Query("""
        SELECT h FROM HopDongThue h
        WHERE h.trangThai = :trangThai
        AND NOT EXISTS (
            SELECT 1 FROM HoaHong hh
            WHERE hh.hopDongThue = h
        )
        """)
    List<HopDongThue> findChoTinhHoaHong(@Param("trangThai") String trangThai);

    @Query("SELECT COUNT(h) FROM HopDongThue h WHERE h.trangThai = :trangThai")
    long countByTrangThai(@Param("trangThai") String trangThai);

    @Query("SELECT COUNT(h) FROM HopDongThue h WHERE MONTH(h.ngayKy) = :thang AND YEAR(h.ngayKy) = :nam")
    long countByThangNam(@Param("thang") int thang, @Param("nam") int nam);

    @Query("""
        SELECT COUNT(h) FROM HopDongThue h
        WHERE h.trangThai = :trangThai
        AND MONTH(h.ngayKy) = :thang AND YEAR(h.ngayKy) = :nam
        """)
    long countByTrangThaiAndThangNam(
        @Param("trangThai") String trangThai,
        @Param("thang") int thang,
        @Param("nam") int nam
    );
}
