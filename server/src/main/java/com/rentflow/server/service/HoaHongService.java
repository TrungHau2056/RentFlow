package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.response.taichinh.HoaHongResponseDTO;
import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.HoaHong;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.HopDongThue;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
import com.rentflow.server.repository.HoaHongRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.LoaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiHoaHong;
import com.rentflow.server.util.enums.TrangThaiHopDongKyGui;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HoaHongService {

    private final HoaHongRepository hoaHongRepo;
    private final HopDongThueRepository hopDongThueRepo;
    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final GiaoDichTaiChinhRepository giaoDichRepo;
    private final NhanVienRepository nhanVienRepo;
    private final TaiChinhConfig config;

    @Transactional
    public HoaHongResponseDTO tinhVaTaoHoaHong(Long hopDongThueId, String username) {
        NhanVien ketoan = nhanVienRepo.findByTaiKhoanUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongThue hopDongThue = hopDongThueRepo.findById(hopDongThueId)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));

        if (hoaHongRepo.existsByHopDongThueId(hopDongThueId)) {
            throw new AppException(ErrorCode.HOA_HONG_DA_TINH);
        }

        BigDecimal soTienHoaHong = hopDongThue.getTienThue()
                .multiply(BigDecimal.valueOf(config.getTyLeHoaHong()));

        Optional<HopDongKyGui> hopDongKyGuiOpt = hopDongKyGuiRepo
                .findByBatDongSanIdAndTrangThai(
                        hopDongThue.getBatDongSan().getId(),
                        TrangThaiHopDongKyGui.DANG_HOAT_DONG.name());

        BigDecimal soTienKhauTru = BigDecimal.ZERO;
        String trangThaiThanhToan = TrangThaiHoaHong.CHUA_THANH_TOAN.name();

        if (hopDongKyGuiOpt.isPresent()) {
            HopDongKyGui hopDongKyGui = hopDongKyGuiOpt.get();
            boolean daCoTienDamBao = giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                    hopDongKyGui.getId(), LoaiGiaoDich.TIEN_DAM_BAO.name());

            if (daCoTienDamBao) {
                soTienKhauTru = config.getTienDamBao();
                trangThaiThanhToan = TrangThaiHoaHong.KHAU_TRU.name();
            }

            hopDongKyGui.setTrangThai(TrangThaiHopDongKyGui.DA_CO_KHACH_THUE.name());
            hopDongKyGuiRepo.save(hopDongKyGui);
        }

        HoaHong hoaHong = HoaHong.builder()
                .hopDongThue(hopDongThue)
                .nhanVienMoiGioi(hopDongThue.getNhanVienMoiGioi())
                .soTien(soTienHoaHong)
                .ngayTinh(LocalDate.now())
                .trangThaiThanhToan(trangThaiThanhToan)
                .build();
        hoaHong = hoaHongRepo.save(hoaHong);

        GiaoDichTaiChinh giaoDich = GiaoDichTaiChinh.builder()
                .nhanVienKeToan(ketoan)
                .hopDongThue(hopDongThue)
                .loaiGiaoDich(LoaiGiaoDich.HOA_HONG.name())
                .soTien(soTienHoaHong)
                .ngayGiaoDich(LocalDateTime.now())
                .trangThai(TrangThaiGiaoDich.HOAN_THANH.name())
                .build();
        giaoDichRepo.save(giaoDich);

        return toDTO(hoaHong, soTienKhauTru);
    }

    public List<HoaHongResponseDTO> layDanhSachHoaHong() {
        return hoaHongRepo.findAll().stream()
                .map(h -> toDTO(h, BigDecimal.ZERO))
                .collect(Collectors.toList());
    }

    public HoaHongResponseDTO layChiTietHoaHong(Long id) {
        HoaHong hoaHong = hoaHongRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_HONG_NOT_FOUND));
        return toDTO(hoaHong, BigDecimal.ZERO);
    }

    @Transactional
    public HoaHongResponseDTO danhDauDaThanhToan(Long id, String username) {
        HoaHong hoaHong = hoaHongRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_HONG_NOT_FOUND));

        if (TrangThaiHoaHong.DA_THANH_TOAN.name().equals(hoaHong.getTrangThaiThanhToan())) {
            throw new AppException(ErrorCode.HOA_HONG_DA_THANH_TOAN);
        }

        hoaHong.setTrangThaiThanhToan(TrangThaiHoaHong.DA_THANH_TOAN.name());
        hoaHong = hoaHongRepo.save(hoaHong);
        return toDTO(hoaHong, BigDecimal.ZERO);
    }

    private HoaHongResponseDTO toDTO(HoaHong h, BigDecimal soTienKhauTru) {
        BigDecimal soTienThucNhan = h.getSoTien().subtract(soTienKhauTru);
        return HoaHongResponseDTO.builder()
                .id(h.getId())
                .hopDongThueId(h.getHopDongThue() != null ? h.getHopDongThue().getId() : null)
                .nhanVienMoiGioiId(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getId() : null)
                .nhanVienMoiGioiHoTen(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getHoTen() : null)
                .soTienHopDong(h.getHopDongThue() != null ? h.getHopDongThue().getTienThue() : null)
                .soTienHoaHong(h.getSoTien())
                .soTienKhauTru(soTienKhauTru)
                .soTienThucNhan(soTienThucNhan)
                .ngayTinh(h.getNgayTinh())
                .trangThaiThanhToan(h.getTrangThaiThanhToan())
                .build();
    }
}
