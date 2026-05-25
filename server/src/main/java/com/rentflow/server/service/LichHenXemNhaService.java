package com.rentflow.server.service;

import com.rentflow.server.dto.request.LichHenXemNhaRequestDTO;
import com.rentflow.server.dto.response.LichHenXemNhaResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.LichHenXemNha;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.LichHenXemNhaRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiLichHen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LichHenXemNhaService {
    private final LichHenXemNhaRepository lichHenXemNhaRepository;
    private final KhachHangRepository khachHangRepository;
    private final BatDongSanRepository batDongSanRepository;
    private final NhanVienRepository nhanVienRepository;
    private final SecurityUtils securityUtils;

    public LichHenXemNhaResponseDTO create(LichHenXemNhaRequestDTO dto) {
        KhachHang kh = khachHangRepository.findById(dto.getKhachHangId())
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        NhanVien nv = null;
        if (dto.getNhanVienId() != null) {
            nv = nhanVienRepository.findById(dto.getNhanVienId())
                    .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        }
        LichHenXemNha entity = LichHenXemNha.builder()
                .khachHang(kh)
                .batDongSan(bds)
                .nhanVien(nv)
                .thoiGian(dto.getThoiGian())
                .trangThai(dto.getTrangThai() != null ? dto.getTrangThai() : TrangThaiLichHen.CHO_XAC_NHAN.name())
                .build();
        return toResponseDTO(lichHenXemNhaRepository.save(entity));
    }

    public List<LichHenXemNhaResponseDTO> getAll(Long nhanVienId, Long khachHangId, Long batDongSanId, String trangThai) {
        List<LichHenXemNha> list;
        if (nhanVienId != null) {
            list = lichHenXemNhaRepository.findByNhanVienId(nhanVienId);
        } else if (khachHangId != null) {
            list = lichHenXemNhaRepository.findByKhachHangId(khachHangId);
        } else if (batDongSanId != null) {
            list = lichHenXemNhaRepository.findByBatDongSanId(batDongSanId);
        } else if (trangThai != null) {
            list = lichHenXemNhaRepository.findByTrangThai(trangThai);
        } else {
            list = lichHenXemNhaRepository.findAll();
        }
        return list.stream().map(this::toResponseDTO).toList();
    }

    public LichHenXemNhaResponseDTO getById(Long id) {
        LichHenXemNha entity = lichHenXemNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        verifyOwnership(entity);
        return toResponseDTO(entity);
    }

    public LichHenXemNhaResponseDTO update(Long id, LichHenXemNhaRequestDTO dto) {
        LichHenXemNha entity = lichHenXemNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        if (dto.getThoiGian() != null) entity.setThoiGian(dto.getThoiGian());
        if (dto.getPhanHoi() != null) entity.setPhanHoi(dto.getPhanHoi());
        if (dto.getNoiDungTraoDoi() != null) entity.setNoiDungTraoDoi(dto.getNoiDungTraoDoi());
        if (dto.getKetQua() != null) entity.setKetQua(dto.getKetQua());
        if (dto.getKhachHangId() != null) {
            KhachHang kh = khachHangRepository.findById(dto.getKhachHangId())
                    .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
            entity.setKhachHang(kh);
        }
        if (dto.getBatDongSanId() != null) {
            BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                    .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
            entity.setBatDongSan(bds);
        }
        return toResponseDTO(lichHenXemNhaRepository.save(entity));
    }

    public LichHenXemNhaResponseDTO updateTrangThai(Long id, String trangThai) {
        LichHenXemNha entity = lichHenXemNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        try {
            TrangThaiLichHen.valueOf(trangThai);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        entity.setTrangThai(trangThai);
        return toResponseDTO(lichHenXemNhaRepository.save(entity));
    }

    public LichHenXemNhaResponseDTO updatePhanHoi(Long id, String phanHoi, String noiDungTraoDoi) {
        LichHenXemNha entity = lichHenXemNhaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        if (phanHoi != null) entity.setPhanHoi(phanHoi);
        if (noiDungTraoDoi != null) entity.setNoiDungTraoDoi(noiDungTraoDoi);
        return toResponseDTO(lichHenXemNhaRepository.save(entity));
    }

    private void verifyOwnership(LichHenXemNha entity) {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        boolean isKhachHang = currentUser.getVaiTro() != null &&
                "KHACH_HANG".equals(currentUser.getVaiTro().getTenVaiTro());
        if (isKhachHang) {
            boolean owns = currentUser.getKhachHangSet() != null &&
                    currentUser.getKhachHangSet().stream()
                            .anyMatch(kh -> kh.getId().equals(entity.getKhachHang().getId()));
            if (!owns) {
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }
        }
    }

    private LichHenXemNhaResponseDTO toResponseDTO(LichHenXemNha entity) {
        return LichHenXemNhaResponseDTO.builder()
                .id(entity.getId())
                .khachHangId(entity.getKhachHang().getId())
                .tenKhachHang(entity.getKhachHang().getHoTen())
                .batDongSanId(entity.getBatDongSan().getId())
                .diaChiBatDongSan(entity.getBatDongSan().getDiaChi())
                .nhanVienId(entity.getNhanVien() != null ? entity.getNhanVien().getId() : null)
                .tenNhanVien(entity.getNhanVien() != null ? entity.getNhanVien().getHoTen() : null)
                .thoiGian(entity.getThoiGian())
                .trangThai(entity.getTrangThai())
                .phanHoi(entity.getPhanHoi())
                .noiDungTraoDoi(entity.getNoiDungTraoDoi())
                .ketQua(entity.getKetQua())
                .build();
    }
}