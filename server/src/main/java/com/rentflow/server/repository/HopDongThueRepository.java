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

    @Query("""
        SELECT COUNT(h) FROM HopDongThue h
        WHERE h.ngayKetThuc BETWEEN :tuNgay AND :denNgay
        AND MONTH(h.ngayKetThuc) = :thang
        AND YEAR(h.ngayKetThuc) = :nam
        """)
    long countHopDongSapHetHan(
        @Param("tuNgay") LocalDate tuNgay,
        @Param("denNgay") LocalDate denNgay,
        @Param("thang") int thang,
        @Param("nam") int nam
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
}
