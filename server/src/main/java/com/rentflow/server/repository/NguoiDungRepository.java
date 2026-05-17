package com.rentflow.server.repository;

import com.rentflow.server.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    @Query("SELECT DISTINCT u FROM NguoiDung u JOIN FETCH u.vaiTros WHERE u.email = :email")
    Optional<NguoiDung> findByEmailWithVaiTro(@Param("email") String email);
}
