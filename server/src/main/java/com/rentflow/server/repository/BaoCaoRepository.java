package com.rentflow.server.repository;

import com.rentflow.server.entity.BaoCao;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BaoCaoRepository extends JpaRepository<BaoCao, Long> {
    List<BaoCao> findByNhanVienAdmin(NhanVien nhanVien);

    List<BaoCao> findByNhanVienAdminOrderByNgayTaoDesc(NhanVien nhanVien);

    Optional<BaoCao> findByIdAndNhanVienAdmin(Long id, NhanVien nhanVien);
}
