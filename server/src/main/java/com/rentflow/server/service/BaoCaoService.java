package com.rentflow.server.service;

import com.rentflow.server.dto.response.baocao.DoanhThuHoaHongResponseDTO;
import com.rentflow.server.dto.response.baocao.HieuSuatMoiGioiResponseDTO;
import com.rentflow.server.dto.response.baocao.ThongKeBatDongSanResponseDTO;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.repository.HoaHongRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.NhanVienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaoCaoService {

    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final HopDongThueRepository hopDongThueRepo;
    private final HoaHongRepository hoaHongRepo;
    private final NhanVienRepository nhanVienRepo;

    public ThongKeBatDongSanResponseDTO thongKeBatDongSan(int thang, int nam) {
        LocalDate now = LocalDate.now();
        long soNhaDangKyGui = hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG");
        long soNhaDaChoThue = hopDongKyGuiRepo.countByTrangThai("DA_CO_KHACH_THUE");
        long soHopDongSapHetHan = hopDongThueRepo.countHopDongSapHetHan(
                now, now.plusDays(30), thang, nam);

        return ThongKeBatDongSanResponseDTO.builder()
                .thang(thang).nam(nam)
                .soNhaDangKyGui(soNhaDangKyGui)
                .soNhaDaChoThue(soNhaDaChoThue)
                .soHopDongSapHetHan(soHopDongSapHetHan)
                .build();
    }

    public DoanhThuHoaHongResponseDTO doanhThuHoaHong(int thang, int nam) {
        BigDecimal tongHoaHong = hoaHongRepo.sumHoaHongByThangNam(thang, nam);
        BigDecimal tongDaThanhToan = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "DA_THANH_TOAN");
        BigDecimal tongChuaThanhToan = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "CHUA_THANH_TOAN");
        BigDecimal tongKhauTru = hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "KHAU_TRU");
        long soLuongHopDong = hoaHongRepo.countByThangNam(thang, nam);

        return DoanhThuHoaHongResponseDTO.builder()
                .thang(thang).nam(nam)
                .soLuongHopDong(soLuongHopDong)
                .tongHoaHong(tongHoaHong)
                .tongDaThanhToan(tongDaThanhToan)
                .tongChuaThanhToan(tongChuaThanhToan)
                .tongKhauTru(tongKhauTru)
                .build();
    }

    public List<HieuSuatMoiGioiResponseDTO> hieuSuatMoiGioi(int thang, int nam) {
        List<NhanVien> dsMoiGioi = nhanVienRepo.findByChucVu("MOI_GIOI");
        return dsMoiGioi.stream().map(nv -> {
            long soHopDong = hopDongThueRepo.countByMoiGioiAndThangNam(nv.getId(), thang, nam);
            BigDecimal tongHoaHong = hoaHongRepo.sumHoaHongByMoiGioiAndThangNam(nv.getId(), thang, nam);
            BigDecimal tongDaThanhToan = hoaHongRepo
                    .sumHoaHongByMoiGioiAndThangNamAndTrangThai(nv.getId(), thang, nam, "DA_THANH_TOAN");
            return HieuSuatMoiGioiResponseDTO.builder()
                    .nhanVienId(nv.getId())
                    .hoTen(nv.getHoTen())
                    .email(nv.getEmail())
                    .thang(thang).nam(nam)
                    .soHopDongDaChot(soHopDong)
                    .tongHoaHongNhan(tongHoaHong)
                    .tongDaThanhToan(tongDaThanhToan)
                    .build();
        }).collect(Collectors.toList());
    }
}
