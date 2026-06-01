package com.rentflow.server.repository;

import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatDongSanRepository extends JpaRepository<BatDongSan, Long> {
    List<BatDongSan> findByChuNhaAndTrangThai(ChuNha chuNha, String trangThai);
    List<BatDongSan> findByTrangThai(String trangThai);
    List<BatDongSan> findByChuNha(ChuNha chuNha);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BatDongSan b WHERE b.id = :id")
    Optional<BatDongSan> findByIdForUpdate(@Param("id") Long id);
}
