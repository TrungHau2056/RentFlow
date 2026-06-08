package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.response.taichinh.HoaHongResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongThueEligibleResponseDTO;
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
import com.rentflow.server.util.enums.TrangThaiHopDong;
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

        BigDecimal tyLeHoaHong = BigDecimal.valueOf(config.getTyLeHoaHong());
        BigDecimal soTienHoaHong = hopDongThue.getTienThue().multiply(tyLeHoaHong);

        Optional<HopDongKyGui> hopDongKyGuiOpt = hopDongKyGuiRepo
                .findByBatDongSanIdAndTrangThai(
                        hopDongThue.getBatDongSan().getId(),
                        TrangThaiHopDongKyGui.DANG_HOAT_DONG.name());

        BigDecimal soTienKhauTru = BigDecimal.ZERO;
        String trangThaiThanhToan = TrangThaiHoaHong.CHUA_THANH_TOAN.name();

        if (hopDongKyGuiOpt.isPresent()) {
            HopDongKyGui hopDongKyGui = hopDongKyGuiOpt.get();
            boolean daCoTienDamBao = giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
                    hopDongKyGui.getId(), LoaiGiaoDich.TIEN_DAM_BAO.name(), TrangThaiGiaoDich.HOAN_THANH.name());
            if (!daCoTienDamBao) {
                daCoTienDamBao = giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                        hopDongKyGui.getId(), LoaiGiaoDich.TIEN_DAM_BAO.name());
            }

            if (daCoTienDamBao) {
                BigDecimal soDuDamBao = tinhSoDuDamBao(hopDongKyGui);
                soTienKhauTru = soTienHoaHong.min(soDuDamBao.max(BigDecimal.ZERO));
                if (soTienKhauTru.compareTo(BigDecimal.ZERO) > 0) {
                    trangThaiThanhToan = TrangThaiHoaHong.KHAU_TRU.name();
                }
            }

            hopDongKyGui.setTrangThai(TrangThaiHopDongKyGui.DA_CO_KHACH_THUE.name());
            hopDongKyGuiRepo.save(hopDongKyGui);
        }

        HoaHong hoaHong = HoaHong.builder()
                .hopDongThue(hopDongThue)
                .nhanVienMoiGioi(hopDongThue.getNhanVienMoiGioi())
                .soTien(soTienHoaHong)
                .tyLeHoaHong(tyLeHoaHong)
                .soTienKhauTru(soTienKhauTru)
                .soTienThucNhan(soTienHoaHong.subtract(soTienKhauTru))
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
                .ghiChu("Ghi nhận hoa hồng môi giới")
                .trangThai(TrangThaiGiaoDich.CHO_XU_LY.name())
                .build();
        giaoDichRepo.save(giaoDich);

        if (hopDongKyGuiOpt.isPresent() && soTienKhauTru.compareTo(BigDecimal.ZERO) > 0) {
            GiaoDichTaiChinh khauTru = GiaoDichTaiChinh.builder()
                    .nhanVienKeToan(ketoan)
                    .hopDongKyGui(hopDongKyGuiOpt.get())
                    .hopDongThue(hopDongThue)
                    .loaiGiaoDich(LoaiGiaoDich.KHAU_TRU_DAM_BAO.name())
                    .soTien(soTienKhauTru)
                    .ngayGiaoDich(LocalDateTime.now())
                    .ghiChu("Khấu trừ tiền đảm bảo để đối trừ hoa hồng")
                    .trangThai(TrangThaiGiaoDich.CHO_XU_LY.name())
                    .build();
            giaoDichRepo.save(khauTru);
        }

        return toDTO(hoaHong);
    }

    public List<HoaHongResponseDTO> layDanhSachHoaHong() {
        return hoaHongRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public HoaHongResponseDTO layChiTietHoaHong(Long id) {
        HoaHong hoaHong = hoaHongRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_HONG_NOT_FOUND));
        return toDTO(hoaHong);
    }

    @Transactional
    public HoaHongResponseDTO danhDauDaThanhToan(Long id, String username) {
        HoaHong hoaHong = hoaHongRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOA_HONG_NOT_FOUND));

        if (TrangThaiHoaHong.DA_THANH_TOAN.name().equals(hoaHong.getTrangThaiThanhToan())) {
            throw new AppException(ErrorCode.HOA_HONG_DA_THANH_TOAN);
        }

        hoaHong.setTrangThaiThanhToan(TrangThaiHoaHong.DA_THANH_TOAN.name());
        hoaHong.setNgayThanhToan(LocalDateTime.now());
        nhanVienRepo.findByTaiKhoanUsername(username).ifPresent(hoaHong::setNhanVienThanhToan);
        hoaHong = hoaHongRepo.save(hoaHong);
        return toDTO(hoaHong);
    }

    public List<HopDongThueEligibleResponseDTO> layHopDongThueChoTinhHoaHong() {
        return hopDongThueRepo.findChoTinhHoaHong(TrangThaiHopDong.DA_KY.name()).stream()
                .map(this::toEligibleDTO)
                .collect(Collectors.toList());
    }

    public String xuatCsvHoaHong() {
        StringBuilder csv = new StringBuilder("ID,Hop dong thue,Moi gioi,Khach thue,Chu nha,Bat dong san,Tien thue,Ty le,Hoa hong,Khau tru,Thuc nhan,Trang thai,Ngay tinh,Ngay thanh toan\n");
        hoaHongRepo.findAll().stream().map(this::toDTO).forEach(h -> csv.append(h.getId()).append(',')
                .append(h.getHopDongThueId() != null ? h.getHopDongThueId() : "").append(',')
                .append(csv(h.getNhanVienMoiGioiHoTen())).append(',')
                .append(csv(h.getKhachHangHoTen())).append(',')
                .append(csv(h.getChuNhaHoTen())).append(',')
                .append(csv(h.getBatDongSanDiaChi())).append(',')
                .append(h.getSoTienHopDong() != null ? h.getSoTienHopDong() : BigDecimal.ZERO).append(',')
                .append(h.getTyLeHoaHong() != null ? h.getTyLeHoaHong() : BigDecimal.ZERO).append(',')
                .append(h.getSoTienHoaHong() != null ? h.getSoTienHoaHong() : BigDecimal.ZERO).append(',')
                .append(h.getSoTienKhauTru() != null ? h.getSoTienKhauTru() : BigDecimal.ZERO).append(',')
                .append(h.getSoTienThucNhan() != null ? h.getSoTienThucNhan() : BigDecimal.ZERO).append(',')
                .append(csv(h.getTrangThaiThanhToan())).append(',')
                .append(csv(h.getNgayTinh() != null ? h.getNgayTinh().toString() : "")).append(',')
                .append(csv(h.getNgayThanhToan() != null ? h.getNgayThanhToan().toString() : "")).append('\n'));
        return csv.toString();
    }

    private HoaHongResponseDTO toDTO(HoaHong h) {
        BigDecimal soTienKhauTru = h.getSoTienKhauTru() != null ? h.getSoTienKhauTru() : BigDecimal.ZERO;
        BigDecimal soTienThucNhan = h.getSoTienThucNhan() != null ? h.getSoTienThucNhan() : h.getSoTien().subtract(soTienKhauTru);
        HopDongThue hopDongThue = h.getHopDongThue();
        Optional<HopDongKyGui> hopDongKyGui = hopDongThue != null && hopDongThue.getBatDongSan() != null
                ? hopDongKyGuiRepo.findByBatDongSanIdAndTrangThai(hopDongThue.getBatDongSan().getId(), TrangThaiHopDongKyGui.DA_CO_KHACH_THUE.name())
                : Optional.empty();
        return HoaHongResponseDTO.builder()
                .id(h.getId())
                .hopDongThueId(hopDongThue != null ? hopDongThue.getId() : null)
                .nhanVienMoiGioiId(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getId() : null)
                .nhanVienMoiGioiHoTen(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getHoTen() : null)
                .soTienHopDong(hopDongThue != null ? hopDongThue.getTienThue() : null)
                .tyLeHoaHong(h.getTyLeHoaHong() != null ? h.getTyLeHoaHong() : BigDecimal.valueOf(config.getTyLeHoaHong()))
                .soTienHoaHong(h.getSoTien())
                .soTienKhauTru(soTienKhauTru)
                .soTienThucNhan(soTienThucNhan)
                .ngayTinh(h.getNgayTinh())
                .ngayThanhToan(h.getNgayThanhToan())
                .trangThaiThanhToan(h.getTrangThaiThanhToan())
                .batDongSanDiaChi(hopDongThue != null && hopDongThue.getBatDongSan() != null ? hopDongThue.getBatDongSan().getDiaChi() : null)
                .khachHangHoTen(hopDongThue != null && hopDongThue.getKhachHang() != null ? hopDongThue.getKhachHang().getHoTen() : null)
                .chuNhaHoTen(hopDongKyGui.map(hd -> hd.getChuNha() != null ? hd.getChuNha().getHoTen() : null).orElse(null))
                .nhanVienThanhToanHoTen(h.getNhanVienThanhToan() != null ? h.getNhanVienThanhToan().getHoTen() : null)
                .build();
    }

    private HopDongThueEligibleResponseDTO toEligibleDTO(HopDongThue h) {
        Optional<HopDongKyGui> hopDongKyGui = h.getBatDongSan() != null
                ? hopDongKyGuiRepo.findByBatDongSanIdAndTrangThai(h.getBatDongSan().getId(), TrangThaiHopDongKyGui.DANG_HOAT_DONG.name())
                : Optional.empty();
        return HopDongThueEligibleResponseDTO.builder()
                .hopDongThueId(h.getId())
                .batDongSanId(h.getBatDongSan() != null ? h.getBatDongSan().getId() : null)
                .batDongSanDiaChi(h.getBatDongSan() != null ? h.getBatDongSan().getDiaChi() : null)
                .khachHangHoTen(h.getKhachHang() != null ? h.getKhachHang().getHoTen() : null)
                .chuNhaHoTen(hopDongKyGui.map(hd -> hd.getChuNha() != null ? hd.getChuNha().getHoTen() : null).orElse(null))
                .nhanVienMoiGioiId(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getId() : null)
                .nhanVienMoiGioiHoTen(h.getNhanVienMoiGioi() != null ? h.getNhanVienMoiGioi().getHoTen() : null)
                .tienThueThang(h.getTienThue())
                .ngayKy(h.getNgayKy())
                .build();
    }

    private BigDecimal tinhSoDuDamBao(HopDongKyGui hopDong) {
        BigDecimal fallback = config.getTienDamBao() != null ? config.getTienDamBao() : BigDecimal.ZERO;
        BigDecimal tienDamBao = hopDong.getTienDamBao() != null && hopDong.getTienDamBao().compareTo(BigDecimal.ZERO) > 0
                ? hopDong.getTienDamBao()
                : fallback;
        BigDecimal daKhauTru = nullSafe(giaoDichRepo.sumByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
                hopDong.getId(), LoaiGiaoDich.KHAU_TRU_DAM_BAO.name(), TrangThaiGiaoDich.HOAN_THANH.name()));
        BigDecimal daHoanTra = nullSafe(giaoDichRepo.sumByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
                hopDong.getId(), LoaiGiaoDich.HOAN_TRA_DAM_BAO.name(), TrangThaiGiaoDich.HOAN_THANH.name()));
        return tienDamBao.subtract(daKhauTru).subtract(daHoanTra);
    }

    private String csv(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
