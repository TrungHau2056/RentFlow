package com.rentflow.server.repository;

import com.rentflow.server.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {
    List<NhanVien> findByChucVu(String chucVu);

    Optional<NhanVien> findByTaiKhoanUsername(String username);

    Optional<NhanVien> findByTaiKhoanId(Long taiKhoanId);

    Optional<NhanVien> findByTaiKhoanUsernameAndChucVu(String username, String chucVu);
}
