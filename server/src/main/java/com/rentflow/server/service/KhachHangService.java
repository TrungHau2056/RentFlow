package com.rentflow.server.service;

import com.rentflow.server.dto.request.KhachHangRequestDTO;
import com.rentflow.server.dto.response.KhachHangResponseDTO;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KhachHangService {
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public List<KhachHangResponseDTO> getAll() {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        if (isMoiGioi(currentUser)) {
            NhanVien nv = nhanVienRepository
                    .findByTaiKhoanUsernameAndChucVu(currentUser.getUsername(), "MOI_GIOI")
                    .orElse(null);
            if (nv == null) {
                return Collections.emptyList();
            }
            return khachHangRepository.findByNhanVienMoiGioiId(nv.getId()).stream()
                    .map(this::toResponseDTO)
                    .toList();
        }
        return khachHangRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private boolean isMoiGioi(TaiKhoan taiKhoan) {
        return taiKhoan.getVaiTro() != null &&
                "MOI_GIOI".equals(taiKhoan.getVaiTro().getTenVaiTro());
    }

    public KhachHangResponseDTO getById(Long id) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        verifyOwnership(kh);
        verifyBrokerAssignment(kh);
        return toResponseDTO(kh);
    }

    public KhachHangResponseDTO getCurrentKhachHang() {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        KhachHang kh = currentUser.getKhachHangSet().stream()
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
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
        verifyBrokerAssignment(kh);
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

    private void verifyBrokerAssignment(KhachHang kh) {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        if (!isMoiGioi(currentUser)) {
            return;
        }
        Long brokerId = kh.getNhanVienMoiGioi() != null ? kh.getNhanVienMoiGioi().getId() : null;
        if (brokerId == null) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        boolean assigned = nhanVienRepository
                .findByTaiKhoanUsernameAndChucVu(currentUser.getUsername(), "MOI_GIOI")
                .map(nv -> nv.getId().equals(brokerId))
                .orElse(false);
        if (!assigned) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
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
                .nhanVienMoiGioiId(kh.getNhanVienMoiGioi() != null ? kh.getNhanVienMoiGioi().getId() : null)
                .build();
    }
}