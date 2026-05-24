package com.rentflow.server.service;

import com.rentflow.server.dto.request.HopDongThueRequestDTO;
import com.rentflow.server.dto.response.HopDongThueResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.HopDongThue;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiBatDongSan;
import com.rentflow.server.util.enums.TrangThaiHopDong;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HopDongThueService {
    private final HopDongThueRepository hopDongThueRepository;
    private final KhachHangRepository khachHangRepository;
    private final BatDongSanRepository batDongSanRepository;
    private final NhanVienRepository nhanVienRepository;
    private final HoaHongService hoaHongService;
    private final SecurityUtils securityUtils;

    public HopDongThueResponseDTO create(HopDongThueRequestDTO dto) {
        KhachHang kh = khachHangRepository.findById(dto.getKhachHangId())
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        NhanVien nv = nhanVienRepository.findById(dto.getNhanVienMoiGioiId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongThue entity = HopDongThue.builder()
                .khachHang(kh)
                .batDongSan(bds)
                .nhanVienMoiGioi(nv)
                .ngayKy(dto.getNgayKy())
                .ngayBatDau(dto.getNgayBatDau())
                .ngayKetThuc(dto.getNgayKetThuc())
                .tienThue(dto.getTienThue())
                .tienCoc(dto.getTienCoc())
                .trangThai(dto.getTrangThai() != null ? dto.getTrangThai() : TrangThaiHopDong.NHAP.name())
                .build();
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    public List<HopDongThueResponseDTO> getAll(String trangThai, Long khachHangId) {
        List<HopDongThue> list;
        if (trangThai != null && khachHangId != null) {
            list = hopDongThueRepository.findAll().stream()
                    .filter(h -> trangThai.equals(h.getTrangThai()))
                    .filter(h -> khachHangId.equals(h.getKhachHang().getId()))
                    .toList();
        } else if (trangThai != null) {
            list = hopDongThueRepository.findAll().stream()
                    .filter(h -> trangThai.equals(h.getTrangThai()))
                    .toList();
        } else if (khachHangId != null) {
            list = hopDongThueRepository.findAll().stream()
                    .filter(h -> khachHangId.equals(h.getKhachHang().getId()))
                    .toList();
        } else {
            list = hopDongThueRepository.findAll();
        }
        return list.stream().map(this::toResponseDTO).toList();
    }

    public HopDongThueResponseDTO getById(Long id) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        return toResponseDTO(entity);
    }

    public HopDongThueResponseDTO update(Long id, HopDongThueRequestDTO dto) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        if (dto.getNgayKy() != null) entity.setNgayKy(dto.getNgayKy());
        if (dto.getNgayBatDau() != null) entity.setNgayBatDau(dto.getNgayBatDau());
        if (dto.getNgayKetThuc() != null) entity.setNgayKetThuc(dto.getNgayKetThuc());
        if (dto.getTienThue() != null) entity.setTienThue(dto.getTienThue());
        if (dto.getTienCoc() != null) entity.setTienCoc(dto.getTienCoc());
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    @Transactional
    public HopDongThueResponseDTO kyHopDong(Long id) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));

        if (!TrangThaiHopDong.NHAP.name().equals(entity.getTrangThai())) {
            throw new AppException(ErrorCode.HOP_DONG_KHONG_HOP_LE);
        }

        BatDongSan bds = entity.getBatDongSan();
        if (!TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name().equals(bds.getTrangThai())) {
            throw new AppException(ErrorCode.INVALID_BAT_DONG_SAN);
        }

        entity.setTrangThai(TrangThaiHopDong.DA_KY.name());
        entity.setNgayKy(LocalDate.now());
        hopDongThueRepository.save(entity);

        bds.setTrangThai(TrangThaiBatDongSan.DA_THUE.name());
        batDongSanRepository.save(bds);

        String username = securityUtils.getCurrentUser().getUsername();
        hoaHongService.tinhVaTaoHoaHong(id, username);

        return toResponseDTO(entity);
    }

    public HopDongThueResponseDTO updateTrangThai(Long id, String trangThai) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        try {
            TrangThaiHopDong.valueOf(trangThai);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        entity.setTrangThai(trangThai);
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    public List<HopDongThueResponseDTO> getMyHopDong() {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        NhanVien nv = nhanVienRepository.findByTaiKhoanId(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        return hopDongThueRepository.findAll().stream()
                .filter(h -> h.getNhanVienMoiGioi() != null
                        && h.getNhanVienMoiGioi().getId().equals(nv.getId()))
                .map(this::toResponseDTO)
                .toList();
    }

    private HopDongThueResponseDTO toResponseDTO(HopDongThue entity) {
        return HopDongThueResponseDTO.builder()
                .id(entity.getId())
                .khachHangId(entity.getKhachHang().getId())
                .tenKhachHang(entity.getKhachHang().getHoTen())
                .batDongSanId(entity.getBatDongSan().getId())
                .diaChiBatDongSan(entity.getBatDongSan().getDiaChi())
                .nhanVienMoiGioiId(entity.getNhanVienMoiGioi().getId())
                .tenNhanVienMoiGioi(entity.getNhanVienMoiGioi().getHoTen())
                .ngayKy(entity.getNgayKy())
                .ngayBatDau(entity.getNgayBatDau())
                .ngayKetThuc(entity.getNgayKetThuc())
                .tienThue(entity.getTienThue())
                .tienCoc(entity.getTienCoc())
                .trangThai(entity.getTrangThai())
                .build();
    }
}