package com.rentflow.server.repository;

import com.rentflow.server.entity.ChuNha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChuNhaRepository extends JpaRepository<ChuNha, Long> {
    Optional<ChuNha> findByTaiKhoanId(Long taiKhoanId);
}
