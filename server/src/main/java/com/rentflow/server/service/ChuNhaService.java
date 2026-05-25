package com.rentflow.server.service;

import com.rentflow.server.dto.request.ChuNhaRequestDTO;
import com.rentflow.server.dto.response.ChuNhaResponseDTO;
import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.ChuNhaRepository;
import com.rentflow.server.repository.TaiKhoanRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChuNhaService {
    private final ChuNhaRepository chuNhaRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final SecurityUtils securityUtils;

    public List<ChuNhaResponseDTO> getAll() {
        return chuNhaRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    public ChuNhaResponseDTO getById(Long id) {
        ChuNha chuNha = chuNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        verifyChuNhaOwnership(chuNha);
        return toResponseDTO(chuNha);
    }

    public ChuNhaResponseDTO create(ChuNhaRequestDTO dto) {
        ChuNha chuNha = ChuNha.builder()
                .hoTen(dto.getHoTen())
                .soDienThoai(dto.getSoDienThoai())
                .email(dto.getEmail())
                .cccd(dto.getCccd())
                .diaChi(dto.getDiaChi())
                .build();
        if (dto.getTaiKhoanId() != null) {
            TaiKhoan taiKhoan = taiKhoanRepository.findById(dto.getTaiKhoanId())
                    .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
            chuNha.setTaiKhoan(taiKhoan);
        }
        return toResponseDTO(chuNhaRepository.save(chuNha));
    }

    public ChuNhaResponseDTO update(Long id, ChuNhaRequestDTO dto) {
        ChuNha chuNha = chuNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        if (dto.getHoTen() != null) chuNha.setHoTen(dto.getHoTen());
        if (dto.getSoDienThoai() != null) chuNha.setSoDienThoai(dto.getSoDienThoai());
        if (dto.getEmail() != null) chuNha.setEmail(dto.getEmail());
        if (dto.getCccd() != null) chuNha.setCccd(dto.getCccd());
        if (dto.getDiaChi() != null) chuNha.setDiaChi(dto.getDiaChi());
        return toResponseDTO(chuNhaRepository.save(chuNha));
    }

    public void delete(Long id) {
        ChuNha chuNha = chuNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        chuNhaRepository.delete(chuNha);
    }

    private void verifyChuNhaOwnership(ChuNha chuNha) {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        boolean isChuNha = currentUser.getVaiTro() != null &&
                "CHU_NHA".equals(currentUser.getVaiTro().getTenVaiTro());
        if (isChuNha) {
            boolean ownsProfile = currentUser.getChuNhaSet() != null &&
                    currentUser.getChuNhaSet().stream()
                            .anyMatch(cn -> cn.getId().equals(chuNha.getId()));
            if (!ownsProfile) {
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }
        }
    }

    private ChuNhaResponseDTO toResponseDTO(ChuNha chuNha) {
        return ChuNhaResponseDTO.builder()
                .id(chuNha.getId())
                .hoTen(chuNha.getHoTen())
                .soDienThoai(chuNha.getSoDienThoai())
                .email(chuNha.getEmail())
                .cccd(chuNha.getCccd())
                .diaChi(chuNha.getDiaChi())
                .taiKhoanId(chuNha.getTaiKhoan() != null ? chuNha.getTaiKhoan().getId() : null)
                .build();
    }
}