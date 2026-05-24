package com.rentflow.server.service;

import com.rentflow.server.dto.request.KhachHangRequestDTO;
import com.rentflow.server.dto.response.KhachHangResponseDTO;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KhachHangService {
    private final KhachHangRepository khachHangRepository;
    private final SecurityUtils securityUtils;

    public List<KhachHangResponseDTO> getAll() {
        return khachHangRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public KhachHangResponseDTO getById(Long id) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        verifyOwnership(kh);
        return toResponseDTO(kh);
    }

    public KhachHangResponseDTO update(Long id, KhachHangRequestDTO dto) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        verifyOwnership(kh);
        if (dto.getHoTen() != null) kh.setHoTen(dto.getHoTen());
        if (dto.getSoDienThoai() != null) kh.setSoDienThoai(dto.getSoDienThoai());
        if (dto.getEmail() != null) kh.setEmail(dto.getEmail());
        if (dto.getNhuCauThue() != null) kh.setNhuCauThue(dto.getNhuCauThue());
        if (dto.getTieuChiTimNha() != null) kh.setTieuChiTimNha(dto.getTieuChiTimNha());
        if (dto.getNhuCauThueChiTiet() != null) kh.setNhuCauThueChiTiet(dto.getNhuCauThueChiTiet());
        return toResponseDTO(khachHangRepository.save(kh));
    }

    public KhachHangResponseDTO updateNhuCau(Long id, KhachHangRequestDTO dto) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        verifyOwnership(kh);
        if (dto.getNhuCauThue() != null) kh.setNhuCauThue(dto.getNhuCauThue());
        if (dto.getTieuChiTimNha() != null) kh.setTieuChiTimNha(dto.getTieuChiTimNha());
        if (dto.getNhuCauThueChiTiet() != null) kh.setNhuCauThueChiTiet(dto.getNhuCauThueChiTiet());
        return toResponseDTO(khachHangRepository.save(kh));
    }

    public void delete(Long id) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        khachHangRepository.delete(kh);
    }

    private void verifyOwnership(KhachHang kh) {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        boolean isKhachHang = currentUser.getVaiTro() != null &&
                "KHACH_HANG".equals(currentUser.getVaiTro().getTenVaiTro());
        if (isKhachHang) {
            boolean owns = currentUser.getKhachHangSet() != null &&
                    currentUser.getKhachHangSet().stream()
                            .anyMatch(k -> k.getId().equals(kh.getId()));
            if (!owns) {
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }
        }
    }

    private KhachHangResponseDTO toResponseDTO(KhachHang kh) {
        return KhachHangResponseDTO.builder()
                .id(kh.getId())
                .hoTen(kh.getHoTen())
                .soDienThoai(kh.getSoDienThoai())
                .email(kh.getEmail())
                .nhuCauThue(kh.getNhuCauThue())
                .tieuChiTimNha(kh.getTieuChiTimNha())
                .nhuCauThueChiTiet(kh.getNhuCauThueChiTiet())
                .build();
    }
}