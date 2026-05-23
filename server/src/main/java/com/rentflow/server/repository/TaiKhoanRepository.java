package com.rentflow.server.repository;

import com.rentflow.server.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {
    @Query("SELECT DISTINCT t FROM TaiKhoan t JOIN FETCH t.vaiTro WHERE t.username = :username")
    Optional<TaiKhoan> findByUsernameWithVaiTro(@Param("username") String username);
}
