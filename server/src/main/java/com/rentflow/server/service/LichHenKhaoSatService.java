package com.rentflow.server.service;

import com.rentflow.server.dto.request.KetQuaKhaoSatRequestDTO;
import com.rentflow.server.dto.request.LichHenKhaoSatRequestDTO;
import com.rentflow.server.dto.response.LichHenKhaoSatResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.LichHenKhaoSat;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.ChuNhaRepository;
import com.rentflow.server.repository.LichHenKhaoSatRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiBatDongSan;
import com.rentflow.server.util.enums.TrangThaiLichHen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LichHenKhaoSatService {
    private final LichHenKhaoSatRepository lichHenKhaoSatRepository;
    private final BatDongSanRepository batDongSanRepository;
    private final ChuNhaRepository chuNhaRepository;
    private final NhanVienRepository nhanVienRepository;
    private final SecurityUtils securityUtils;

    public List<LichHenKhaoSatResponseDTO> getAll() {
        return lichHenKhaoSatRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    public LichHenKhaoSatResponseDTO getById(Long id) {
        LichHenKhaoSat lh = lichHenKhaoSatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        verifyChuNhaOwnership(lh.getChuNha().getId());
        return toResponseDTO(lh);
    }

    public LichHenKhaoSatResponseDTO create(LichHenKhaoSatRequestDTO dto) {
        BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        ChuNha chuNha = chuNhaRepository.findById(dto.getChuNhaId())
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        NhanVien nhanVien = nhanVienRepository.findById(dto.getNhanVienId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        LichHenKhaoSat lh = LichHenKhaoSat.builder()
                .batDongSan(bds)
                .chuNha(chuNha)
                .nhanVien(nhanVien)
                .thoiGian(dto.getThoiGian())
                .trangThai(TrangThaiLichHen.CHO_XAC_NHAN.name())
                .build();
        return toResponseDTO(lichHenKhaoSatRepository.save(lh));
    }

    public LichHenKhaoSatResponseDTO update(Long id, LichHenKhaoSatRequestDTO dto) {
        LichHenKhaoSat lh = lichHenKhaoSatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        if (!lh.getTrangThai().equals(TrangThaiLichHen.CHO_XAC_NHAN.name())) {
            throw new AppException(ErrorCode.INVALID_LICH_HEN);
        }
        if (dto.getThoiGian() != null) lh.setThoiGian(dto.getThoiGian());
        return toResponseDTO(lichHenKhaoSatRepository.save(lh));
    }

    public LichHenKhaoSatResponseDTO updateTrangThai(Long id, String trangThaiMoi) {
        LichHenKhaoSat lh = lichHenKhaoSatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));

        try {
            TrangThaiLichHen.valueOf(trangThaiMoi);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        TaiKhoan currentUser = securityUtils.getCurrentUser();
        boolean isChuNha = currentUser.getVaiTro() != null &&
                "CHU_NHA".equals(currentUser.getVaiTro().getTenVaiTro());

        if (isChuNha) {
            boolean owns = currentUser.getChuNhaSet() != null &&
                    currentUser.getChuNhaSet().stream()
                            .anyMatch(cn -> cn.getId().equals(lh.getChuNha().getId()));
            if (!owns) {
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }
            if (!trangThaiMoi.equals(TrangThaiLichHen.DA_XAC_NHAN.name()) &&
                    !trangThaiMoi.equals(TrangThaiLichHen.DA_HUY.name())) {
                throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
            }
        }

        lh.setTrangThai(trangThaiMoi);
        return toResponseDTO(lichHenKhaoSatRepository.save(lh));
    }

    public LichHenKhaoSatResponseDTO ghiNhanKetQua(Long id, KetQuaKhaoSatRequestDTO dto) {
        LichHenKhaoSat lh = lichHenKhaoSatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));

        if (!lh.getTrangThai().equals(TrangThaiLichHen.DA_XAC_NHAN.name())) {
            throw new AppException(ErrorCode.INVALID_LICH_HEN);
        }

        lh.setKetQuaKhaoSat(dto.getKetQuaKhaoSat());
        lh.setTrangThai(TrangThaiLichHen.DA_HOAN_THANH.name());

        if (Boolean.TRUE.equals(dto.getDat())) {
            BatDongSan bds = lh.getBatDongSan();
            bds.setTrangThai(TrangThaiBatDongSan.DA_KHAO_SAT.name());
            batDongSanRepository.save(bds);
        }

        return toResponseDTO(lichHenKhaoSatRepository.save(lh));
    }

    public void delete(Long id) {
        LichHenKhaoSat lh = lichHenKhaoSatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        lichHenKhaoSatRepository.delete(lh);
    }

    private void verifyChuNhaOwnership(Long chuNhaId) {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        boolean isChuNha = currentUser.getVaiTro() != null &&
                "CHU_NHA".equals(currentUser.getVaiTro().getTenVaiTro());
        if (isChuNha) {
            boolean owns = currentUser.getChuNhaSet() != null &&
                    currentUser.getChuNhaSet().stream()
                            .anyMatch(cn -> cn.getId().equals(chuNhaId));
            if (!owns) {
                throw new AppException(ErrorCode.ACCESS_DENIED);
            }
        }
    }

    private LichHenKhaoSatResponseDTO toResponseDTO(LichHenKhaoSat lh) {
        return LichHenKhaoSatResponseDTO.builder()
                .id(lh.getId())
                .batDongSanId(lh.getBatDongSan().getId())
                .diaChiBatDongSan(lh.getBatDongSan().getDiaChi())
                .chuNhaId(lh.getChuNha().getId())
                .tenChuNha(lh.getChuNha().getHoTen())
                .nhanVienId(lh.getNhanVien().getId())
                .tenNhanVien(lh.getNhanVien().getHoTen())
                .thoiGian(lh.getThoiGian())
                .trangThai(lh.getTrangThai())
                .ketQuaKhaoSat(lh.getKetQuaKhaoSat())
                .build();
    }
}