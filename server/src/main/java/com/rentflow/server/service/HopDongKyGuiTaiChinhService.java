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
import java.math.BigDecimal;
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
                .filter(hd -> tinhSoDuDamBao(hd).compareTo(BigDecimal.ZERO) > 0)
                .map(this::toEligibleDTO)
                .collect(Collectors.toList());
    }

    public List<HopDongKyGuiEligibleResponseDTO> layHopDongChoGhiNhanThu() {
        return hopDongKyGuiRepo.findChoGhiNhanThu(
                        TrangThaiHopDongKyGui.DANG_HOAT_DONG.name(),
                        LoaiGiaoDich.TIEN_DAM_BAO.name())
                .stream()
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

        if (giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
                hopDong.getId(), LoaiGiaoDich.HOAN_TRA_DAM_BAO.name(), TrangThaiGiaoDich.HOAN_THANH.name())) {
            throw new AppException(ErrorCode.DA_HOAN_TRA);
        }

        BigDecimal soDuDamBao = tinhSoDuDamBao(hopDong);
        if (soDuDamBao.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.SO_DU_DAM_BAO_KHONG_DU);
        }

        GiaoDichTaiChinh giaoDich = GiaoDichTaiChinh.builder()
                .nhanVienKeToan(ketoan)
                .hopDongKyGui(hopDong)
                .loaiGiaoDich(LoaiGiaoDich.HOAN_TRA_DAM_BAO.name())
                .soTien(soDuDamBao)
                .ngayGiaoDich(LocalDateTime.now())
                .ghiChu(dto.getLyDoChAmDut())
                .trangThai(TrangThaiGiaoDich.CHO_XU_LY.name())
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
                .tienDamBaoChuaChi(tinhSoDuDamBao(hd))
                .build();
    }

    private BigDecimal tinhSoDuDamBao(HopDongKyGui hopDong) {
        BigDecimal tienDamBao = giaoDichService.resolveTienDamBao(hopDong);
        if (tienDamBao == null) {
            tienDamBao = hopDong.getTienDamBao() != null ? hopDong.getTienDamBao() : config.getTienDamBao();
        }
        if (tienDamBao == null) {
            tienDamBao = BigDecimal.ZERO;
        }
        BigDecimal daKhauTru = nullSafe(giaoDichService.sumGiaoDichHoanThanh(hopDong.getId(), LoaiGiaoDich.KHAU_TRU_DAM_BAO));
        BigDecimal daHoanTra = nullSafe(giaoDichService.sumGiaoDichHoanThanh(hopDong.getId(), LoaiGiaoDich.HOAN_TRA_DAM_BAO));
        return tienDamBao.subtract(daKhauTru).subtract(daHoanTra);
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
