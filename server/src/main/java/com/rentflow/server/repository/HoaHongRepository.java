package com.rentflow.server.repository;

import com.rentflow.server.entity.HoaHong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaHongRepository extends JpaRepository<HoaHong, Long> {

    boolean existsByHopDongThueId(Long hopDongThueId);

    Optional<HoaHong> findByHopDongThueId(Long hopDongThueId);

    List<HoaHong> findByNhanVienMoiGioiId(Long nhanVienMoiGioiId);
}
