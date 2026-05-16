package com.rentflow.server.repository;

import com.rentflow.server.entity.ChuNha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChuNhaRepository extends JpaRepository<ChuNha, Long> {
}
