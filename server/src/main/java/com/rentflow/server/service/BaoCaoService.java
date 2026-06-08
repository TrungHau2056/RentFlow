package com.rentflow.server.service;

import com.rentflow.server.dto.response.baocao.*;
import com.rentflow.server.entity.BaoCao;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.*;
import com.rentflow.server.util.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaoCaoService {

    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final HopDongThueRepository hopDongThueRepo;
    private final HoaHongRepository hoaHongRepo;
    private final NhanVienRepository nhanVienRepo;
    private final BatDongSanRepository batDongSanRepo;
    private final BaoCaoRepository baoCaoRepo;

    public ThongKeBatDongSanResponseDTO thongKeBatDongSan(int thang, int nam) {
        LocalDate now = LocalDate.now();
        long soNhaDangKyGui = hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG");
        long soNhaDaChoThue = hopDongKyGuiRepo.countByTrangThai("DA_CO_KHACH_THUE");
        long soHopDongSapHetHan = hopDongThueRepo.countHopDongSapHetHan(
                now, now.plusDays(30));

        // Extended stats
        long tongSoBatDongSan = batDongSanRepo.count();
        long soNhaDaBan = batDongSanRepo.countByTrangThai("DA_BAN");
        long soNhaConTrong = batDongSanRepo.countByTrangThai("CON_TRONG");

        // Group by loaiNha (loaiHinh)
        List<Object[]> loaiHinhData = batDongSanRepo.countGroupByLoaiNha();
        List<ThongKeLoaiHinhDTO> thongKeLoaiHinh = loaiHinhData.stream()
                .map(row -> ThongKeLoaiHinhDTO.builder()
                        .loaiHinh((String) row[0])
                        .soLuong((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        // Return empty list for khuVuc (field doesn't exist in entity yet)
        List<ThongKeKhuVucDTO> thongKeKhuVuc = new ArrayList<>();

        return ThongKeBatDongSanResponseDTO.builder()
                .thang(thang).nam(nam)
                .soNhaDangKyGui(soNhaDangKyGui)
                .soNhaDaChoThue(soNhaDaChoThue)
                .soHopDongSapHetHan(soHopDongSapHetHan)
                .tongSoBatDongSan(tongSoBatDongSan)
                .soNhaDaBan(soNhaDaBan)
                .soNhaConTrong(soNhaConTrong)
                .thongKeKhuVuc(thongKeKhuVuc)
                .thongKeLoaiHinh(thongKeLoaiHinh)
                .build();
    }

    public BaoCaoHopDongResponseDTO baoCaoHopDong(int thang, int nam) {
        LocalDate now = LocalDate.now();

        // Hop dong ky gui stats
        long tongHopDongKyGui = hopDongKyGuiRepo.count();
        long hopDongKyGuiConHieuLuc = hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG");
        long hopDongKyGuiHetHan = hopDongKyGuiRepo.countByTrangThaiAndHetHan("DA_KET_THUC", now);

        // Hop dong thue stats
        long tongHopDongThue = hopDongThueRepo.count();
        long hopDongThueMoi = hopDongThueRepo.countByThangNam(thang, nam);
        long hopDongThueDangHoatDong = hopDongThueRepo.countByTrangThai("DANG_HOAT_DONG");
        long hopDongThueKetThuc = hopDongThueRepo.countByTrangThai("DA_KET_THUC");

        return BaoCaoHopDongResponseDTO.builder()
                .thang(thang).nam(nam)
                .tongHopDongKyGui(tongHopDongKyGui)
                .hopDongKyGuiConHieuLuc(hopDongKyGuiConHieuLuc)
                .hopDongKyGuiHetHan(hopDongKyGuiHetHan)
                .tongHopDongThue(tongHopDongThue)
                .hopDongThueMoi(hopDongThueMoi)
                .hopDongThueDangHoatDong(hopDongThueDangHoatDong)
                .hopDongThueKetThuc(hopDongThueKetThuc)
                .build();
    }

    public DoanhThuHoaHongResponseDTO doanhThuHoaHong(int thang, int nam) {
        BigDecimal tongHoaHong = hoaHongRepo.sumHoaHongByThangNam(thang, nam);
        BigDecimal tongDaThanhToan = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "DA_THANH_TOAN");
        BigDecimal tongChuaThanhToan = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "CHUA_THANH_TOAN");
        BigDecimal tongKhauTru = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "KHAU_TRU");
        long soLuongHopDong = hoaHongRepo.countByThangNam(thang, nam);

        // Monthly stats (12 months)
        List<DoanhThuThangDTO> doanhThuThang = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            BigDecimal dt = hoaHongRepo.sumHoaHongByThangNam(m, nam);
            BigDecimal hh = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(m, nam, "DA_THANH_TOAN");
            doanhThuThang.add(DoanhThuThangDTO.builder()
                    .thang(m)
                    .doanhThu(dt)
                    .hoaHong(hh)
                    .build());
        }

        // Quarterly stats (4 quarters) — derived from monthly data, no extra queries
        List<DoanhThuQuyDTO> doanhThuQuy = new ArrayList<>();
        for (int q = 1; q <= 4; q++) {
            BigDecimal dt = BigDecimal.ZERO;
            BigDecimal hh = BigDecimal.ZERO;
            for (int m = (q - 1) * 3 + 1; m <= q * 3; m++) {
                DoanhThuThangDTO monthData = doanhThuThang.get(m - 1);
                dt = dt.add(monthData.getDoanhThu());
                hh = hh.add(monthData.getHoaHong());
            }
            doanhThuQuy.add(DoanhThuQuyDTO.builder()
                    .quy(q)
                    .doanhThu(dt)
                    .hoaHong(hh)
                    .build());
        }

        // Commission by employee
        List<NhanVien> allNhanVien = nhanVienRepo.findByChucVu("MOI_GIOI");
        List<HoaHongNhanVienDTO> hoaHongTheoNhanVien = allNhanVien.stream()
                .map(nv -> HoaHongNhanVienDTO.builder()
                        .nhanVienId(nv.getId())
                        .hoTen(nv.getHoTen())
                        .soTienHoaHong(hoaHongRepo.sumHoaHongByMoiGioiAndThangNam(nv.getId(), thang, nam))
                        .soHopDong(hopDongThueRepo.countByMoiGioiAndThangNam(nv.getId(), thang, nam))
                        .build())
                .filter(dto -> dto.getSoTienHoaHong().compareTo(BigDecimal.ZERO) > 0 || dto.getSoHopDong() > 0)
                .collect(Collectors.toList());

        // Calculate commission collection rate (tyLeHoaHong)
        BigDecimal tyLeHoaHong = BigDecimal.ZERO;
        if (tongHoaHong.compareTo(BigDecimal.ZERO) > 0) {
            tyLeHoaHong = tongDaThanhToan.multiply(BigDecimal.valueOf(100))
                    .divide(tongHoaHong, 2, RoundingMode.HALF_UP);
        }

        return DoanhThuHoaHongResponseDTO.builder()
                .thang(thang).nam(nam)
                .soLuongHopDong(soLuongHopDong)
                .tongHoaHong(tongHoaHong)
                .tongDaThanhToan(tongDaThanhToan)
                .tongChuaThanhToan(tongChuaThanhToan)
                .tongKhauTru(tongKhauTru)
                .doanhThuThang(doanhThuThang)
                .doanhThuQuy(doanhThuQuy)
                .hoaHongTheoNhanVien(hoaHongTheoNhanVien)
                .tyLeHoaHong(tyLeHoaHong)
                .build();
    }

    public List<HieuSuatMoiGioiResponseDTO> hieuSuatMoiGioi(int thang, int nam) {
        List<NhanVien> dsMoiGioi = nhanVienRepo.findByChucVu("MOI_GIOI");
        List<HieuSuatMoiGioiResponseDTO> result = dsMoiGioi.stream().map(nv -> {
            long soHopDong = hopDongThueRepo.countByMoiGioiAndThangNam(nv.getId(), thang, nam);
            BigDecimal tongHoaHong = hoaHongRepo.sumHoaHongByMoiGioiAndThangNam(nv.getId(), thang, nam);
            BigDecimal tongDaThanhToan = hoaHongRepo
                    .sumHoaHongByMoiGioiAndThangNamAndTrangThai(nv.getId(), thang, nam, "DA_THANH_TOAN");

            // Count total potential deals (all contracts assigned — same period)
            long tongGiaoDich = hopDongThueRepo.countByMoiGioiAndThangNam(nv.getId(), thang, nam);

            // Calculate close rate: percentage of this broker's period contracts
            double tyLeChot = 0.0;
            long tongAllTime = hopDongThueRepo.countByNhanVienMoiGioiId(nv.getId());
            if (tongAllTime > 0) {
                tyLeChot = Math.round((double) soHopDong / tongAllTime * 100.0 * 10.0) / 10.0;
            }

            return HieuSuatMoiGioiResponseDTO.builder()
                    .nhanVienId(nv.getId())
                    .hoTen(nv.getHoTen())
                    .email(nv.getEmail())
                    .thang(thang).nam(nam)
                    .soHopDongDaChot(soHopDong)
                    .tongHoaHongNhan(tongHoaHong)
                    .tongDaThanhToan(tongDaThanhToan)
                    .soGiaoDichThucHien(tongGiaoDich)
                    .tyLeChot(tyLeChot)
                    .hang(0)
                    .build();
        }).collect(Collectors.toList());

        // Sort by soHopDongDaChot descending, then assign rank (with ties)
        result.sort(Comparator.comparingLong(HieuSuatMoiGioiResponseDTO::getSoHopDongDaChot).reversed());
        int currentRank = 0;
        long prevValue = -1;
        for (int i = 0; i < result.size(); i++) {
            long val = result.get(i).getSoHopDongDaChot();
            if (val != prevValue) {
                currentRank = i + 1;
                prevValue = val;
            }
            result.get(i).setHang(currentRank);
        }

        return result;
    }

    @Transactional
    public BaoCaoLichSuDTO luuBaoCao(NhanVien admin, String loai, String noiDung, int thang, int nam) {
        BaoCao baoCao = BaoCao.builder()
                .nhanVienAdmin(admin)
                .loaiBaoCao(loai)
                .noiDung(noiDung)
                .ngayTao(LocalDateTime.now())
                .thang(thang)
                .nam(nam)
                .build();
        BaoCao saved = baoCaoRepo.save(baoCao);
        return BaoCaoLichSuDTO.builder()
                .id(saved.getId())
                .loaiBaoCao(saved.getLoaiBaoCao())
                .noiDung(saved.getNoiDung())
                .ngayTao(saved.getNgayTao())
                .thang(saved.getThang())
                .nam(saved.getNam())
                .build();
    }

    public List<BaoCaoLichSuDTO> lichSuBaoCao(NhanVien admin) {
        List<BaoCao> ds = baoCaoRepo.findByNhanVienAdminOrderByNgayTaoDesc(admin);
        return ds.stream().map(bc -> BaoCaoLichSuDTO.builder()
                .id(bc.getId())
                .loaiBaoCao(bc.getLoaiBaoCao())
                .noiDung(bc.getNoiDung())
                .ngayTao(bc.getNgayTao())
                .thang(bc.getThang())
                .nam(bc.getNam())
                .build()).collect(Collectors.toList());
    }

    public BaoCaoLichSuDTO chiTietBaoCao(Long id, NhanVien admin) {
        BaoCao bc = baoCaoRepo.findByIdAndNhanVienAdmin(id, admin)
                .orElseThrow(() -> new AppException(ErrorCode.BAO_CAO_NOT_FOUND));
        return BaoCaoLichSuDTO.builder()
                .id(bc.getId())
                .loaiBaoCao(bc.getLoaiBaoCao())
                .noiDung(bc.getNoiDung())
                .ngayTao(bc.getNgayTao())
                .thang(bc.getThang())
                .nam(bc.getNam())
                .build();
    }
}
