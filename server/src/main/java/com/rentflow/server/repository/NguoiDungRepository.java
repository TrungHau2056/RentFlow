package com.rentflow.server.repository;

import com.rentflow.server.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
}
