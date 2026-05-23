package com.rentflow.server.repository;

import com.rentflow.server.entity.BaoCao;
import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaoCaoRepository extends JpaRepository<BaoCao, Long> {
    List<BaoCao> findByNhanVienAdmin(NhanVien nhanVien);
}
