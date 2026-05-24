package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.request.GhiNhanThuRequestDTO;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.LoaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiHopDongKyGui;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiaoDichTaiChinhService {

    private final GiaoDichTaiChinhRepository giaoDichRepo;
    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final NhanVienRepository nhanVienRepo;
    private final TaiChinhConfig config;

    @Transactional
    public GiaoDichTaiChinhResponseDTO ghiNhanTienDamBao(GhiNhanThuRequestDTO dto, String username) {
        NhanVien ketoan = nhanVienRepo.findByTaiKhoanUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongKyGui hopDong = hopDongKyGuiRepo.findById(dto.getHopDongKyGuiId())
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_KY_GUI_NOT_FOUND));

        if (!TrangThaiHopDongKyGui.DANG_HOAT_DONG.name().equals(hopDong.getTrangThai())) {
            throw new AppException(ErrorCode.HOP_DONG_KHONG_HOP_LE);
        }

        if (giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                hopDong.getId(), LoaiGiaoDich.TIEN_DAM_BAO.name())) {
            throw new AppException(ErrorCode.TIEN_DAM_BAO_DA_THU);
        }

        GiaoDichTaiChinh giaoDich = GiaoDichTaiChinh.builder()
                .nhanVienKeToan(ketoan)
                .hopDongKyGui(hopDong)
                .loaiGiaoDich(LoaiGiaoDich.TIEN_DAM_BAO.name())
                .soTien(config.getTienDamBao())
                .ngayGiaoDich(LocalDateTime.now())
                .trangThai(TrangThaiGiaoDich.HOAN_THANH.name())
                .build();

        giaoDich = giaoDichRepo.save(giaoDich);
        return toDTO(giaoDich);
    }

    public List<GiaoDichTaiChinhResponseDTO> layDanhSachGiaoDich(String loaiGiaoDich) {
        List<GiaoDichTaiChinh> list = (loaiGiaoDich != null && !loaiGiaoDich.isBlank())
                ? giaoDichRepo.findByLoaiGiaoDich(loaiGiaoDich)
                : giaoDichRepo.findAll();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public GiaoDichTaiChinhResponseDTO layChiTietGiaoDich(Long id) {
        GiaoDichTaiChinh giaoDich = giaoDichRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GIAO_DICH_NOT_FOUND));
        return toDTO(giaoDich);
    }

    public GiaoDichTaiChinhResponseDTO toDTO(GiaoDichTaiChinh g) {
        return GiaoDichTaiChinhResponseDTO.builder()
                .id(g.getId())
                .loaiGiaoDich(g.getLoaiGiaoDich())
                .soTien(g.getSoTien())
                .ngayGiaoDich(g.getNgayGiaoDich())
                .trangThai(g.getTrangThai())
                .hopDongKyGuiId(g.getHopDongKyGui() != null ? g.getHopDongKyGui().getId() : null)
                .hopDongThueId(g.getHopDongThue() != null ? g.getHopDongThue().getId() : null)
                .nhanVienKeToanId(g.getNhanVienKeToan() != null ? g.getNhanVienKeToan().getId() : null)
                .nhanVienKeToanHoTen(g.getNhanVienKeToan() != null ? g.getNhanVienKeToan().getHoTen() : null)
                .build();
    }
}
