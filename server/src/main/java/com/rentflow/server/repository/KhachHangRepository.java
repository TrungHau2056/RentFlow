package com.rentflow.server.repository;

import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Long> {
    Optional<KhachHang> findByTaiKhoan(TaiKhoan taiKhoan);
    Optional<KhachHang> findByEmail(String email);
    boolean existsByEmail(String email);
}