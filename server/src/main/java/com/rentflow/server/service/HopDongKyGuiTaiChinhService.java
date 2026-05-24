package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.request.YeuCauHoanTraRequestDTO;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongKyGuiEligibleResponseDTO;
import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.LoaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiHopDongKyGui;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HopDongKyGuiTaiChinhService {

    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final HopDongThueRepository hopDongThueRepo;
    private final GiaoDichTaiChinhRepository giaoDichRepo;
    private final NhanVienRepository nhanVienRepo;
    private final GiaoDichTaiChinhService giaoDichService;
    private final TaiChinhConfig config;

    public List<HopDongKyGuiEligibleResponseDTO> quetHopDongDuDieuKienHoanTra() {
        LocalDate ngayNguong = LocalDate.now().minusMonths(config.getThoiHanKyGuiThang());

        List<HopDongKyGui> danhSach = hopDongKyGuiRepo.findHopDongHetHan(
                TrangThaiHopDongKyGui.DANG_HOAT_DONG.name(), ngayNguong);

        return danhSach.stream()
                .filter(hd -> !hopDongThueRepo.existsByBatDongSanIdAndTrangThai(
                        hd.getBatDongSan().getId(),
                        TrangThaiHopDongKyGui.DANG_HOAT_DONG.name()))
                .filter(hd -> !giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                        hd.getId(), LoaiGiaoDich.HOAN_TRA_DAM_BAO.name()))
                .map(this::toEligibleDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GiaoDichTaiChinhResponseDTO xuatLenhHoanTra(YeuCauHoanTraRequestDTO dto, String username) {
        NhanVien ketoan = nhanVienRepo.findByTaiKhoanUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongKyGui hopDong = hopDongKyGuiRepo.findById(dto.getHopDongKyGuiId())
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_KY_GUI_NOT_FOUND));

        boolean duDieuKien = quetHopDongDuDieuKienHoanTra().stream()
                .anyMatch(e -> e.getHopDongKyGuiId().equals(hopDong.getId()));
        if (!duDieuKien) {
            throw new AppException(ErrorCode.HOP_DONG_CHUA_DU_DIEU_KIEN);
        }

        if (giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                hopDong.getId(), LoaiGiaoDich.HOAN_TRA_DAM_BAO.name())) {
            throw new AppException(ErrorCode.DA_HOAN_TRA);
        }

        hopDong.setTrangThai(TrangThaiHopDongKyGui.DA_KET_THUC.name());
        hopDongKyGuiRepo.save(hopDong);

        GiaoDichTaiChinh giaoDich = GiaoDichTaiChinh.builder()
                .nhanVienKeToan(ketoan)
                .hopDongKyGui(hopDong)
                .loaiGiaoDich(LoaiGiaoDich.HOAN_TRA_DAM_BAO.name())
                .soTien(config.getTienDamBao())
                .ngayGiaoDich(LocalDateTime.now())
                .trangThai(TrangThaiGiaoDich.HOAN_THANH.name())
                .build();

        giaoDich = giaoDichRepo.save(giaoDich);
        return giaoDichService.toDTO(giaoDich);
    }

    private HopDongKyGuiEligibleResponseDTO toEligibleDTO(HopDongKyGui hd) {
        long soThang = ChronoUnit.MONTHS.between(hd.getNgayBatDau(), LocalDate.now());
        return HopDongKyGuiEligibleResponseDTO.builder()
                .hopDongKyGuiId(hd.getId())
                .chuNhaId(hd.getChuNha() != null ? hd.getChuNha().getId() : null)
                .chuNhaHoTen(hd.getChuNha() != null ? hd.getChuNha().getHoTen() : null)
                .batDongSanId(hd.getBatDongSan() != null ? hd.getBatDongSan().getId() : null)
                .batDongSanDiaChi(hd.getBatDongSan() != null ? hd.getBatDongSan().getDiaChi() : null)
                .ngayBatDau(hd.getNgayBatDau())
                .soThangDaQua(soThang)
                .tienDamBaoChuaChi(config.getTienDamBao())
                .build();
    }
}
