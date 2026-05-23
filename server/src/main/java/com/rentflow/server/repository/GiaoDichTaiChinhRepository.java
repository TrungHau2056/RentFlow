package com.rentflow.server.repository;

import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiaoDichTaiChinhRepository extends JpaRepository<GiaoDichTaiChinh, Long> {
    List<GiaoDichTaiChinh> findByNhanVienKeToan(NhanVien nhanVien);
}
