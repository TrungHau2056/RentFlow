package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.response.taichinh.HoaHongResponseDTO;
import com.rentflow.server.entity.*;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
import com.rentflow.server.repository.HoaHongRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HoaHongServiceTest {

    @Mock
    private HoaHongRepository hoaHongRepo;
    @Mock
    private HopDongThueRepository hopDongThueRepo;
    @Mock
    private HopDongKyGuiRepository hopDongKyGuiRepo;
    @Mock
    private GiaoDichTaiChinhRepository giaoDichRepo;
    @Mock
    private NhanVienRepository nhanVienRepo;
    @Mock
    private TaiChinhConfig config;

    @InjectMocks
    private HoaHongService service;

    private final BigDecimal tienThue = new BigDecimal("10000000");
    private final BigDecimal soTienHoaHong = new BigDecimal("5000000"); // 10tr * 0.5

    @Test
    void tinhVaTaoHoaHong_shouldReturn_whenNoDeposit_noKhauTru() {
        NhanVien ketoan = NhanVien.builder().id(1L).hoTen("Ke Toan").build();
        NhanVien moiGioi = NhanVien.builder().id(2L).hoTen("Moi Gioi").build();
        BatDongSan bds = BatDongSan.builder().id(1L).build();
        HopDongThue hopDongThue = HopDongThue.builder()
                .id(1L).tienThue(tienThue)
                .batDongSan(bds)
                .nhanVienMoiGioi(moiGioi).build();
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongThueRepo.findById(1L)).thenReturn(Optional.of(hopDongThue));
        when(hoaHongRepo.existsByHopDongThueId(1L)).thenReturn(false);
        when(config.getTyLeHoaHong()).thenReturn(0.5);
        when(hopDongKyGuiRepo.findByBatDongSanIdAndTrangThai(any(), any()))
                .thenReturn(Optional.empty());
        when(hoaHongRepo.save(any())).thenAnswer(i -> {
            HoaHong h = i.getArgument(0);
            return HoaHong.builder()
                    .id(1L).hopDongThue(h.getHopDongThue())
                    .nhanVienMoiGioi(h.getNhanVienMoiGioi())
                    .soTien(h.getSoTien())
                    .tyLeHoaHong(h.getTyLeHoaHong())
                    .soTienKhauTru(h.getSoTienKhauTru())
                    .soTienThucNhan(h.getSoTienThucNhan())
                    .ngayTinh(h.getNgayTinh())
                    .trangThaiThanhToan(h.getTrangThaiThanhToan())
                    .build();
        });
        when(giaoDichRepo.save(any())).thenReturn(mock(GiaoDichTaiChinh.class));

        HoaHongResponseDTO result = service.tinhVaTaoHoaHong(1L, "ke.toan");

        assertThat(result)
                .hasFieldOrPropertyWithValue("trangThaiThanhToan", "CHUA_THANH_TOAN")
                .satisfies(r -> assertThat(r.getSoTienKhauTru()).isEqualByComparingTo(BigDecimal.ZERO))
                .satisfies(r -> assertThat(r.getSoTienThucNhan()).isEqualByComparingTo(soTienHoaHong));
    }

    @Test
    void tinhVaTaoHoaHong_shouldReturn_whenHasDeposit_khauTru() {
        NhanVien ketoan = NhanVien.builder().id(1L).hoTen("Ke Toan").build();
        NhanVien moiGioi = NhanVien.builder().id(2L).hoTen("Moi Gioi").build();
        HopDongThue hopDongThue = HopDongThue.builder()
                .id(1L).tienThue(tienThue)
                .nhanVienMoiGioi(moiGioi).build();
        BatDongSan bds = BatDongSan.builder().id(1L).build();
        hopDongThue.setBatDongSan(bds);
        HopDongKyGui hopDongKyGui = HopDongKyGui.builder().id(1L).build();

        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongThueRepo.findById(1L)).thenReturn(Optional.of(hopDongThue));
        when(hoaHongRepo.existsByHopDongThueId(1L)).thenReturn(false);
        when(config.getTyLeHoaHong()).thenReturn(0.5);
        when(hopDongKyGuiRepo.findByBatDongSanIdAndTrangThai(1L, "DANG_HOAT_DONG"))
                .thenReturn(Optional.of(hopDongKyGui));
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "TIEN_DAM_BAO"))
                .thenReturn(true);
        when(config.getTienDamBao()).thenReturn(new BigDecimal("5000000"));
        when(hoaHongRepo.save(any())).thenAnswer(i -> {
            HoaHong h = i.getArgument(0);
            return HoaHong.builder()
                    .id(1L).hopDongThue(h.getHopDongThue())
                    .nhanVienMoiGioi(h.getNhanVienMoiGioi())
                    .soTien(h.getSoTien())
                    .tyLeHoaHong(h.getTyLeHoaHong())
                    .soTienKhauTru(h.getSoTienKhauTru())
                    .soTienThucNhan(h.getSoTienThucNhan())
                    .ngayTinh(h.getNgayTinh())
                    .trangThaiThanhToan(h.getTrangThaiThanhToan())
                    .build();
        });
        when(giaoDichRepo.save(any())).thenReturn(mock(GiaoDichTaiChinh.class));

        HoaHongResponseDTO result = service.tinhVaTaoHoaHong(1L, "ke.toan");

        assertThat(result)
                .hasFieldOrPropertyWithValue("trangThaiThanhToan", "KHAU_TRU")
                .satisfies(r -> assertThat(r.getSoTienKhauTru()).isEqualByComparingTo("5000000"))
                .satisfies(r -> assertThat(r.getSoTienThucNhan()).isEqualByComparingTo("0"));
    }

    @Test
    void tinhVaTaoHoaHong_shouldThrow_whenContractNotFound() {
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(NhanVien.builder().build()));
        when(hopDongThueRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.tinhVaTaoHoaHong(99L, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
    }

    @Test
    void tinhVaTaoHoaHong_shouldThrow_whenCommissionAlreadyExists() {
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(NhanVien.builder().build()));
        when(hopDongThueRepo.findById(1L)).thenReturn(Optional.of(HopDongThue.builder().build()));
        when(hoaHongRepo.existsByHopDongThueId(1L)).thenReturn(true);

        assertThatThrownBy(() -> service.tinhVaTaoHoaHong(1L, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOA_HONG_DA_TINH));
    }

    @Test
    void layDanhSachHoaHong_shouldReturnList() {
        when(hoaHongRepo.findAll()).thenReturn(List.of(
                HoaHong.builder().id(1L).soTien(BigDecimal.valueOf(1000)).ngayTinh(LocalDate.now())
                        .trangThaiThanhToan("CHUA_THANH_TOAN").build(),
                HoaHong.builder().id(2L).soTien(BigDecimal.valueOf(2000)).ngayTinh(LocalDate.now())
                        .trangThaiThanhToan("DA_THANH_TOAN").build()));

        List<HoaHongResponseDTO> result = service.layDanhSachHoaHong();

        assertThat(result).hasSize(2);
    }

    @Test
    void layChiTietHoaHong_shouldReturn_whenFound() {
        when(hoaHongRepo.findById(1L)).thenReturn(Optional.of(
                HoaHong.builder().id(1L).soTien(BigDecimal.valueOf(1000))
                        .ngayTinh(LocalDate.now()).trangThaiThanhToan("CHUA_THANH_TOAN").build()));

        HoaHongResponseDTO result = service.layChiTietHoaHong(1L);

        assertThat(result).hasFieldOrPropertyWithValue("id", 1L);
    }

    @Test
    void layChiTietHoaHong_shouldThrow_whenNotFound() {
        when(hoaHongRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.layChiTietHoaHong(99L))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOA_HONG_NOT_FOUND));
    }

    @Test
    void danhDauDaThanhToan_shouldReturn_whenSuccess() {
        HoaHong hoaHong = HoaHong.builder().id(1L).soTien(BigDecimal.valueOf(1000))
                .ngayTinh(LocalDate.now()).trangThaiThanhToan("CHUA_THANH_TOAN").build();
        when(hoaHongRepo.findById(1L)).thenReturn(Optional.of(hoaHong));
        when(hoaHongRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        HoaHongResponseDTO result = service.danhDauDaThanhToan(1L, "ke.toan");

        assertThat(result).hasFieldOrPropertyWithValue("trangThaiThanhToan", "DA_THANH_TOAN");
    }

    @Test
    void danhDauDaThanhToan_shouldThrow_whenAlreadyPaid() {
        HoaHong hoaHong = HoaHong.builder().id(1L).soTien(BigDecimal.valueOf(1000))
                .trangThaiThanhToan("DA_THANH_TOAN").build();
        when(hoaHongRepo.findById(1L)).thenReturn(Optional.of(hoaHong));

        assertThatThrownBy(() -> service.danhDauDaThanhToan(1L, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOA_HONG_DA_THANH_TOAN));
    }
}
