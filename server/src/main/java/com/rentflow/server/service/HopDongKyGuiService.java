package com.rentflow.server.service;

import com.rentflow.server.dto.request.HopDongKyGuiRequestDTO;
import com.rentflow.server.dto.request.PheDuyetRequestDTO;
import com.rentflow.server.dto.response.HopDongKyGuiResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.ChuNha;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.ChuNhaRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiBatDongSan;
import com.rentflow.server.util.enums.TrangThaiHopDong;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HopDongKyGuiService {
    private final HopDongKyGuiRepository hopDongKyGuiRepository;
    private final BatDongSanRepository batDongSanRepository;
    private final ChuNhaRepository chuNhaRepository;
    private final NhanVienRepository nhanVienRepository;
    private final SecurityUtils securityUtils;

    public List<HopDongKyGuiResponseDTO> getAll() {
        return hopDongKyGuiRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    public HopDongKyGuiResponseDTO getById(Long id) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        verifyChuNhaOwnership(hd.getChuNha().getId());
        return toResponseDTO(hd);
    }

    public HopDongKyGuiResponseDTO create(HopDongKyGuiRequestDTO dto) {
        BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        ChuNha chuNha = chuNhaRepository.findById(dto.getChuNhaId())
                .orElseThrow(() -> new AppException(ErrorCode.CHU_NHA_NOT_FOUND));
        NhanVien nhanVien = nhanVienRepository.findById(dto.getNhanVienId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongKyGui hd = HopDongKyGui.builder()
                .batDongSan(bds)
                .chuNha(chuNha)
                .nhanVien(nhanVien)
                .ngayBatDau(dto.getNgayBatDau())
                .ngayKetThuc(dto.getNgayKetThuc())
                .tienDamBao(dto.getTienDamBao())
                .trangThai(TrangThaiHopDong.NHAP.name())
                .build();
        return toResponseDTO(hopDongKyGuiRepository.save(hd));
    }

    public HopDongKyGuiResponseDTO update(Long id, HopDongKyGuiRequestDTO dto) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        String currentStatus = hd.getTrangThai();
        if (!currentStatus.equals(TrangThaiHopDong.NHAP.name()) &&
                !currentStatus.equals(TrangThaiHopDong.TU_CHOI.name())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        if (dto.getNgayBatDau() != null) hd.setNgayBatDau(dto.getNgayBatDau());
        if (dto.getNgayKetThuc() != null) hd.setNgayKetThuc(dto.getNgayKetThuc());
        if (dto.getTienDamBao() != null) hd.setTienDamBao(dto.getTienDamBao());
        return toResponseDTO(hopDongKyGuiRepository.save(hd));
    }

    public void delete(Long id) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        if (!hd.getTrangThai().equals(TrangThaiHopDong.NHAP.name())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        hopDongKyGuiRepository.delete(hd);
    }

    public HopDongKyGuiResponseDTO guiPheDuyet(Long id) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        if (!hd.getTrangThai().equals(TrangThaiHopDong.NHAP.name())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        hd.setTrangThai(TrangThaiHopDong.CHO_PHE_DUYET.name());
        return toResponseDTO(hopDongKyGuiRepository.save(hd));
    }

    public HopDongKyGuiResponseDTO pheDuyet(Long id, PheDuyetRequestDTO dto) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        if (!hd.getTrangThai().equals(TrangThaiHopDong.CHO_PHE_DUYET.name())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        if (dto.isDuyet()) {
            hd.setTrangThai(TrangThaiHopDong.DA_PHE_DUYET.name());
        } else {
            hd.setTrangThai(TrangThaiHopDong.TU_CHOI.name());
        }
        return toResponseDTO(hopDongKyGuiRepository.save(hd));
    }

    public HopDongKyGuiResponseDTO kyKet(Long id) {
        HopDongKyGui hd = hopDongKyGuiRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_NOT_FOUND));
        if (!hd.getTrangThai().equals(TrangThaiHopDong.DA_PHE_DUYET.name())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        hd.setTrangThai(TrangThaiHopDong.DA_KY.name());
        hd.setNgayKy(LocalDate.now());

        BatDongSan bds = hd.getBatDongSan();
        bds.setTrangThai(TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name());
        batDongSanRepository.save(bds);

        return toResponseDTO(hopDongKyGuiRepository.save(hd));
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
    private HopDongKyGuiResponseDTO toResponseDTO(HopDongKyGui hd) {
        return HopDongKyGuiResponseDTO.builder()
                .id(hd.getId())
                .chuNhaId(hd.getChuNha().getId())
                .tenChuNha(hd.getChuNha().getHoTen())
                .batDongSanId(hd.getBatDongSan().getId())
                .diaChiBatDongSan(hd.getBatDongSan().getDiaChi())
                .nhanVienId(hd.getNhanVien().getId())
                .tenNhanVien(hd.getNhanVien().getHoTen())
                .ngayKy(hd.getNgayKy())
                .ngayBatDau(hd.getNgayBatDau())
                .ngayKetThuc(hd.getNgayKetThuc())
                .tienDamBao(hd.getTienDamBao())
                .trangThai(hd.getTrangThai())
                .build();
    }
}
