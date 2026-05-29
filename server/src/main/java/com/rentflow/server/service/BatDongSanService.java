package com.rentflow.server.service;

import com.rentflow.server.dto.request.BatDongSanChiTietRequestDTO;
import com.rentflow.server.dto.request.BatDongSanRequestDTO;
import com.rentflow.server.dto.response.BatDongSanDetailDTO;
import com.rentflow.server.dto.response.BatDongSanResponseDTO;
import com.rentflow.server.dto.response.BatDongSanSummaryDTO;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public List<BatDongSanSummaryDTO> getAllPublic() {
        return batDongSanRepository.findByTrangThai(TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name())
                .stream().map(this::toSummaryDTO).toList();
    }

    public Object getByIdPublic(Long id) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal());
        if (isAuthenticated) {
            return toDetailDTO(bds);
        }
        return toSummaryDTO(bds);
    }

    public BatDongSanDetailDTO getDetail(Long id) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        return toDetailDTO(bds);
    }

    public List<BatDongSanSummaryDTO> search(String loaiNha, Double giaMin, Double giaMax, Double dienTichMin, Double dienTichMax, String huong) {
        return batDongSanRepository.findAll().stream()
                .filter(b -> TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name().equals(b.getTrangThai()))
                .filter(b -> loaiNha == null || loaiNha.equals(b.getLoaiNha()))
                .filter(b -> giaMin == null || b.getGiaThue() >= giaMin)
                .filter(b -> giaMax == null || b.getGiaThue() <= giaMax)
                .filter(b -> dienTichMin == null || b.getDienTich() >= dienTichMin)
                .filter(b -> dienTichMax == null || b.getDienTich() <= dienTichMax)
                .filter(b -> huong == null || huong.equals(b.getHuong()))
                .map(this::toSummaryDTO)
                .toList();
    }

    public BatDongSanDetailDTO updateChiTiet(Long id, BatDongSanChiTietRequestDTO dto) {
        BatDongSan bds = batDongSanRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        if (dto.getLoaiNha() != null) bds.setLoaiNha(dto.getLoaiNha());
        if (dto.getHuong() != null) bds.setHuong(dto.getHuong());
        if (dto.getSoPhongNgu() != null) bds.setSoPhongNgu(dto.getSoPhongNgu());
        if (dto.getSoPhongVeSinh() != null) bds.setSoPhongVeSinh(dto.getSoPhongVeSinh());
        if (dto.getGiaDeXuat() != null) bds.setGiaDeXuat(dto.getGiaDeXuat());
        return toDetailDTO(batDongSanRepository.save(bds));
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

    private BatDongSanSummaryDTO toSummaryDTO(BatDongSan bds) {
        return BatDongSanSummaryDTO.builder()
                .id(bds.getId())
                .diaChi(bds.getDiaChi())
                .dienTich(bds.getDienTich())
                .giaThue(bds.getGiaThue())
                .loaiNha(bds.getLoaiNha())
                .huong(bds.getHuong())
                .soPhongNgu(bds.getSoPhongNgu())
                .soPhongVeSinh(bds.getSoPhongVeSinh())
                .trangThai(bds.getTrangThai())
                .build();
    }

    private BatDongSanDetailDTO toDetailDTO(BatDongSan bds) {
        return BatDongSanDetailDTO.builder()
                .id(bds.getId())
                .chuNhaId(bds.getChuNha().getId())
                .tenChuNha(bds.getChuNha().getHoTen())
                .diaChi(bds.getDiaChi())
                .dienTich(bds.getDienTich())
                .giaThue(bds.getGiaThue())
                .giaDeXuat(bds.getGiaDeXuat())
                .loaiNha(bds.getLoaiNha())
                .huong(bds.getHuong())
                .soPhongNgu(bds.getSoPhongNgu())
                .soPhongVeSinh(bds.getSoPhongVeSinh())
                .moTa(bds.getMoTa())
                .trangThai(bds.getTrangThai())
                .build();
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