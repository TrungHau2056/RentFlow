package com.rentflow.server.service;

import com.rentflow.server.dto.response.baocao.*;
import com.rentflow.server.entity.BaoCao;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BaoCaoServiceTest {

    @Mock
    private HopDongKyGuiRepository hopDongKyGuiRepo;
    @Mock
    private HopDongThueRepository hopDongThueRepo;
    @Mock
    private HoaHongRepository hoaHongRepo;
    @Mock
    private NhanVienRepository nhanVienRepo;
    @Mock
    private BatDongSanRepository batDongSanRepo;
    @Mock
    private BaoCaoRepository baoCaoRepo;

    @InjectMocks
    private BaoCaoService service;

    private final int currentThang = LocalDate.now().getMonthValue();
    private final int currentNam = LocalDate.now().getYear();

    @Test
    void thongKeBatDongSan_shouldReturn_whenDefaultMonthYear() {
        when(hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(5L);
        when(hopDongKyGuiRepo.countByTrangThai("DA_CO_KHACH_THUE")).thenReturn(3L);
        when(hopDongThueRepo.countHopDongSapHetHan(any(), any()))
                .thenReturn(2L);
        when(batDongSanRepo.count()).thenReturn(30L);
        when(batDongSanRepo.countByTrangThai("DA_BAN")).thenReturn(5L);
        when(batDongSanRepo.countByTrangThai("CON_TRONG")).thenReturn(10L);
        when(batDongSanRepo.countGroupByLoaiNha()).thenReturn(new ArrayList<>());

        ThongKeBatDongSanResponseDTO result = service.thongKeBatDongSan(currentThang, currentNam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("thang", currentThang)
                .hasFieldOrPropertyWithValue("nam", currentNam)
                .hasFieldOrPropertyWithValue("soNhaDangKyGui", 5L)
                .hasFieldOrPropertyWithValue("soNhaDaChoThue", 3L)
                .hasFieldOrPropertyWithValue("soHopDongSapHetHan", 2L)
                .hasFieldOrPropertyWithValue("tongSoBatDongSan", 30L)
                .hasFieldOrPropertyWithValue("soNhaDaBan", 5L)
                .hasFieldOrPropertyWithValue("soNhaConTrong", 10L);
    }

    @Test
    void thongKeBatDongSan_shouldReturn_whenCustomMonthYear() {
        int thang = 3;
        int nam = 2025;
        when(hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(2L);
        when(hopDongKyGuiRepo.countByTrangThai("DA_CO_KHACH_THUE")).thenReturn(1L);
        when(hopDongThueRepo.countHopDongSapHetHan(any(), any()))
                .thenReturn(0L);
        when(batDongSanRepo.count()).thenReturn(20L);
        when(batDongSanRepo.countByTrangThai("DA_BAN")).thenReturn(3L);
        when(batDongSanRepo.countByTrangThai("CON_TRONG")).thenReturn(5L);
        when(batDongSanRepo.countGroupByLoaiNha()).thenReturn(new ArrayList<>());

        ThongKeBatDongSanResponseDTO result = service.thongKeBatDongSan(thang, nam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("thang", thang)
                .hasFieldOrPropertyWithValue("nam", nam)
                .hasFieldOrPropertyWithValue("soNhaDangKyGui", 2L)
                .hasFieldOrPropertyWithValue("tongSoBatDongSan", 20L)
                .hasFieldOrPropertyWithValue("soNhaDaBan", 3L)
                .hasFieldOrPropertyWithValue("soNhaConTrong", 5L);
    }

    @Test
    void doanhThuHoaHong_shouldReturn_whenHasData() {
        int thang = 6;
        int nam = 2025;
        when(hoaHongRepo.sumHoaHongByThangNam(thang, nam)).thenReturn(new BigDecimal("50000000"));
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "DA_THANH_TOAN"))
                .thenReturn(new BigDecimal("30000000"));
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "CHUA_THANH_TOAN"))
                .thenReturn(new BigDecimal("15000000"));
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "KHAU_TRU"))
                .thenReturn(new BigDecimal("5000000"));
        when(hoaHongRepo.countByThangNam(thang, nam)).thenReturn(10L);
        // Monthly mock
        for (int m = 1; m <= 12; m++) {
            when(hoaHongRepo.sumHoaHongByThangNam(m, nam)).thenReturn(BigDecimal.ZERO);
            when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(m, nam, "DA_THANH_TOAN")).thenReturn(BigDecimal.ZERO);
        }
        when(hoaHongRepo.sumHoaHongByThangNam(thang, nam)).thenReturn(new BigDecimal("50000000"));
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "DA_THANH_TOAN")).thenReturn(new BigDecimal("30000000"));
        when(nhanVienRepo.findByChucVu("MOI_GIOI")).thenReturn(new ArrayList<>());

        DoanhThuHoaHongResponseDTO result = service.doanhThuHoaHong(thang, nam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("thang", thang)
                .hasFieldOrPropertyWithValue("nam", nam)
                .hasFieldOrPropertyWithValue("soLuongHopDong", 10L)
                .satisfies(r -> assertThat(r.getTongHoaHong()).isEqualByComparingTo("50000000"))
                .satisfies(r -> assertThat(r.getTongDaThanhToan()).isEqualByComparingTo("30000000"))
                .satisfies(r -> assertThat(r.getTongChuaThanhToan()).isEqualByComparingTo("15000000"))
                .satisfies(r -> assertThat(r.getTongKhauTru()).isEqualByComparingTo("5000000"));
        assertThat(result.getDoanhThuThang()).hasSize(12);
        assertThat(result.getDoanhThuQuy()).hasSize(4);
        // tyLeHoaHong = tongDaThanhToan / tongHoaHong * 100 = 30M / 50M * 100 = 60.0
        assertThat(result.getTyLeHoaHong()).isEqualByComparingTo(new BigDecimal("60.00"));
    }

    @Test
    void doanhThuHoaHong_shouldReturnZero_whenNoData() {
        int thang = 7;
        int nam = 2025;
        when(hoaHongRepo.sumHoaHongByThangNam(thang, nam)).thenReturn(BigDecimal.ZERO);
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "DA_THANH_TOAN"))
                .thenReturn(BigDecimal.ZERO);
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "CHUA_THANH_TOAN"))
                .thenReturn(BigDecimal.ZERO);
        when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(thang, nam, "KHAU_TRU"))
                .thenReturn(BigDecimal.ZERO);
        when(hoaHongRepo.countByThangNam(thang, nam)).thenReturn(0L);
        for (int m = 1; m <= 12; m++) {
            when(hoaHongRepo.sumHoaHongByThangNam(m, nam)).thenReturn(BigDecimal.ZERO);
            when(hoaHongRepo.sumHoaHongByThangNamAndTrangThai(m, nam, "DA_THANH_TOAN")).thenReturn(BigDecimal.ZERO);
        }
        when(nhanVienRepo.findByChucVu("MOI_GIOI")).thenReturn(new ArrayList<>());

        DoanhThuHoaHongResponseDTO result = service.doanhThuHoaHong(thang, nam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("soLuongHopDong", 0L)
                .satisfies(r -> assertThat(r.getTongHoaHong()).isEqualByComparingTo(BigDecimal.ZERO))
                .satisfies(r -> assertThat(r.getTongDaThanhToan()).isEqualByComparingTo(BigDecimal.ZERO))
                .satisfies(r -> assertThat(r.getTongChuaThanhToan()).isEqualByComparingTo(BigDecimal.ZERO))
                .satisfies(r -> assertThat(r.getTongKhauTru()).isEqualByComparingTo(BigDecimal.ZERO));
        assertThat(result.getDoanhThuThang()).hasSize(12);
        assertThat(result.getDoanhThuQuy()).hasSize(4);
    }

    @Test
    void hieuSuatMoiGioi_shouldReturnList_whenHasBrokers() {
        int thang = 8;
        int nam = 2025;
        NhanVien nv1 = NhanVien.builder().id(1L).hoTen("Nguyen Van A").email("a@test.com").build();
        NhanVien nv2 = NhanVien.builder().id(2L).hoTen("Tran Thi B").email("b@test.com").build();
        when(nhanVienRepo.findByChucVu("MOI_GIOI")).thenReturn(List.of(nv1, nv2));
        when(hopDongThueRepo.countByMoiGioiAndThangNam(1L, thang, nam)).thenReturn(3L);
        when(hopDongThueRepo.countByMoiGioiAndThangNam(2L, thang, nam)).thenReturn(5L);
        when(hoaHongRepo.sumHoaHongByMoiGioiAndThangNam(1L, thang, nam))
                .thenReturn(new BigDecimal("15000000"));
        when(hoaHongRepo.sumHoaHongByMoiGioiAndThangNam(2L, thang, nam))
                .thenReturn(new BigDecimal("25000000"));
        when(hoaHongRepo.sumHoaHongByMoiGioiAndThangNamAndTrangThai(1L, thang, nam, "DA_THANH_TOAN"))
                .thenReturn(new BigDecimal("10000000"));
        when(hoaHongRepo.sumHoaHongByMoiGioiAndThangNamAndTrangThai(2L, thang, nam, "DA_THANH_TOAN"))
                .thenReturn(new BigDecimal("20000000"));
        when(hopDongThueRepo.countByMoiGioiAndThangNam(1L, thang, nam)).thenReturn(3L);
        when(hopDongThueRepo.countByMoiGioiAndThangNam(2L, thang, nam)).thenReturn(5L);
        when(hopDongThueRepo.countByNhanVienMoiGioiId(1L)).thenReturn(5L);
        when(hopDongThueRepo.countByNhanVienMoiGioiId(2L)).thenReturn(10L);

        List<HieuSuatMoiGioiResponseDTO> result = service.hieuSuatMoiGioi(thang, nam);

        assertThat(result).hasSize(2);
        // Sorted by soHopDongDaChot desc, so nv2 (5) comes first, nv1 (3) second
        assertThat(result.get(0))
                .hasFieldOrPropertyWithValue("nhanVienId", 2L)
                .hasFieldOrPropertyWithValue("soHopDongDaChot", 5L)
                .hasFieldOrPropertyWithValue("soGiaoDichThucHien", 5L)
                .hasFieldOrPropertyWithValue("hang", 1);
        assertThat(result.get(0).getTyLeChot()).isEqualTo(50.0);
        assertThat(result.get(1))
                .hasFieldOrPropertyWithValue("nhanVienId", 1L)
                .hasFieldOrPropertyWithValue("soHopDongDaChot", 3L)
                .hasFieldOrPropertyWithValue("soGiaoDichThucHien", 3L)
                .hasFieldOrPropertyWithValue("hang", 2);
    }

    @Test
    void hieuSuatMoiGioi_shouldReturnEmpty_whenNoBrokers() {
        when(nhanVienRepo.findByChucVu("MOI_GIOI")).thenReturn(List.of());

        List<HieuSuatMoiGioiResponseDTO> result = service.hieuSuatMoiGioi(1, 2025);

        assertThat(result).isEmpty();
    }

    @Test
    void baoCaoHopDong_shouldReturnStats_whenHasData() {
        int thang = 6;
        int nam = 2025;
        when(hopDongKyGuiRepo.count()).thenReturn(10L);
        when(hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(7L);
        when(hopDongKyGuiRepo.countByTrangThaiAndHetHan(eq("DA_KET_THUC"), any())).thenReturn(3L);
        when(hopDongThueRepo.count()).thenReturn(15L);
        when(hopDongThueRepo.countByThangNam(thang, nam)).thenReturn(5L);
        when(hopDongThueRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(8L);
        when(hopDongThueRepo.countByTrangThai("DA_KET_THUC")).thenReturn(2L);

        BaoCaoHopDongResponseDTO result = service.baoCaoHopDong(thang, nam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("thang", thang)
                .hasFieldOrPropertyWithValue("nam", nam)
                .hasFieldOrPropertyWithValue("tongHopDongKyGui", 10L)
                .hasFieldOrPropertyWithValue("hopDongKyGuiConHieuLuc", 7L)
                .hasFieldOrPropertyWithValue("hopDongKyGuiHetHan", 3L)
                .hasFieldOrPropertyWithValue("tongHopDongThue", 15L)
                .hasFieldOrPropertyWithValue("hopDongThueMoi", 5L)
                .hasFieldOrPropertyWithValue("hopDongThueDangHoatDong", 8L)
                .hasFieldOrPropertyWithValue("hopDongThueKetThuc", 2L);
    }

    @Test
    void baoCaoHopDong_shouldReturnZero_whenNoData() {
        int thang = 6;
        int nam = 2025;
        when(hopDongKyGuiRepo.count()).thenReturn(0L);
        when(hopDongKyGuiRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(0L);
        when(hopDongKyGuiRepo.countByTrangThaiAndHetHan(eq("DA_KET_THUC"), any())).thenReturn(0L);
        when(hopDongThueRepo.count()).thenReturn(0L);
        when(hopDongThueRepo.countByThangNam(thang, nam)).thenReturn(0L);
        when(hopDongThueRepo.countByTrangThai("DANG_HOAT_DONG")).thenReturn(0L);
        when(hopDongThueRepo.countByTrangThai("DA_KET_THUC")).thenReturn(0L);

        BaoCaoHopDongResponseDTO result = service.baoCaoHopDong(thang, nam);

        assertThat(result)
                .hasFieldOrPropertyWithValue("tongHopDongKyGui", 0L)
                .hasFieldOrPropertyWithValue("hopDongKyGuiConHieuLuc", 0L)
                .hasFieldOrPropertyWithValue("hopDongKyGuiHetHan", 0L)
                .hasFieldOrPropertyWithValue("tongHopDongThue", 0L)
                .hasFieldOrPropertyWithValue("hopDongThueMoi", 0L)
                .hasFieldOrPropertyWithValue("hopDongThueDangHoatDong", 0L)
                .hasFieldOrPropertyWithValue("hopDongThueKetThuc", 0L);
    }

    @Test
    void luuBaoCao_shouldSaveAndReturn() {
        NhanVien admin = NhanVien.builder().id(1L).hoTen("Admin").build();
        BaoCao saved = BaoCao.builder()
                .id(1L)
                .nhanVienAdmin(admin)
                .loaiBaoCao("TONG_HOP")
                .noiDung("{}")
                .thang(6)
                .nam(2025)
                .build();
        when(baoCaoRepo.save(any(BaoCao.class))).thenReturn(saved);

        BaoCaoLichSuDTO result = service.luuBaoCao(admin, "TONG_HOP", "{}", 6, 2025);

        assertThat(result)
                .hasFieldOrPropertyWithValue("id", 1L)
                .hasFieldOrPropertyWithValue("loaiBaoCao", "TONG_HOP")
                .hasFieldOrPropertyWithValue("thang", 6)
                .hasFieldOrPropertyWithValue("nam", 2025);
    }

    @Test
    void lichSuBaoCao_shouldReturnRecentFirst() {
        NhanVien admin = NhanVien.builder().id(1L).build();
        List<BaoCao> ds = List.of(
                BaoCao.builder().id(2L).loaiBaoCao("DOANH_THU").thang(6).nam(2025).build(),
                BaoCao.builder().id(1L).loaiBaoCao("TONG_HOP").thang(5).nam(2025).build()
        );
        when(baoCaoRepo.findByNhanVienAdminOrderByNgayTaoDesc(admin)).thenReturn(ds);

        List<BaoCaoLichSuDTO> result = service.lichSuBaoCao(admin);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(2L);
        assertThat(result.get(1).getId()).isEqualTo(1L);
    }
}
