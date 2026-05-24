package com.rentflow.server.service;

import com.rentflow.server.dto.request.BatDongSanRequestDTO;
import com.rentflow.server.dto.response.BatDongSanResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.ChuNhaRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiBatDongSan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatDongSanService {
    private final BatDongSanRepository batDongSanRepository;
    private final ChuNhaRepository chuNhaRepository;
    private final SecurityUtils securityUtils;

    public List<BatDongSanResponseDTO> getAll(String trangThai) {
        List<BatDongSan> list;
        if (trangThai != null && !trangThai.isEmpty()) {
            list = batDongSanRepository.findByTrangThai(trangThai);
        } else {
            list = batDongSanRepository.findAll();
        }
        return list.stream().map(this::toResponseDTO).toList();
    }

    public BatDongSanResponseDTO getById(Long id) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        return toResponseDTO(bds);
    }

    public List<BatDongSanResponseDTO> getByChuNha(Long chuNhaId) {
        verifyChuNhaOwnership(chuNhaId);
        ChuNha chuNha = chuNhaRepository.findById(chuNhaId)
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        return batDongSanRepository.findByChuNha(chuNha)
                .stream().map(this::toResponseDTO).toList();
    }

    public List<BatDongSanResponseDTO> getYeuCauMoi() {
        return batDongSanRepository.findByTrangThai(TrangThaiBatDongSan.CHO_DUYET.name())
                .stream().map(this::toResponseDTO).toList();
    }

    public BatDongSanResponseDTO create(BatDongSanRequestDTO dto) {
        ChuNha chuNha = chuNhaRepository.findById(dto.getChuNhaId())
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        BatDongSan bds = BatDongSan.builder()
                .chuNha(chuNha)
                .diaChi(dto.getDiaChi())
                .dienTich(dto.getDienTich())
                .giaThue(dto.getGiaThue())
                .moTa(dto.getMoTa())
                .trangThai(TrangThaiBatDongSan.CHO_DUYET.name())
                .build();
        return toResponseDTO(batDongSanRepository.save(bds));
    }

    public BatDongSanResponseDTO update(Long id, BatDongSanRequestDTO dto) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        verifyChuNhaOwnership(bds.getChuNha().getId());
        if (dto.getDiaChi() != null) bds.setDiaChi(dto.getDiaChi());
        if (dto.getDienTich() != null) bds.setDienTich(dto.getDienTich());
        if (dto.getGiaThue() != null) bds.setGiaThue(dto.getGiaThue());
        if (dto.getMoTa() != null) bds.setMoTa(dto.getMoTa());
        return toResponseDTO(batDongSanRepository.save(bds));
    }

    public void delete(Long id) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        batDongSanRepository.delete(bds);
    }

    public BatDongSanResponseDTO updateTrangThai(Long id, String trangThaiMoi) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));

        try {
            TrangThaiBatDongSan.valueOf(trangThaiMoi);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        bds.setTrangThai(trangThaiMoi);
        return toResponseDTO(batDongSanRepository.save(bds));
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

    private BatDongSanResponseDTO toResponseDTO(BatDongSan bds) {
        return BatDongSanResponseDTO.builder()
                .id(bds.getId())
                .chuNhaId(bds.getChuNha().getId())
                .tenChuNha(bds.getChuNha().getHoTen())
                .diaChi(bds.getDiaChi())
                .dienTich(bds.getDienTich())
                .giaThue(bds.getGiaThue())
                .moTa(bds.getMoTa())
                .trangThai(bds.getTrangThai())
                .build();
    }
}