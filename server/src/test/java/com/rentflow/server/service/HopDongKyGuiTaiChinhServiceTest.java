package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.request.YeuCauHoanTraRequestDTO;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongKyGuiEligibleResponseDTO;
import com.rentflow.server.entity.*;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HopDongKyGuiTaiChinhServiceTest {

    @Mock
    private HopDongKyGuiRepository hopDongKyGuiRepo;
    @Mock
    private HopDongThueRepository hopDongThueRepo;
    @Mock
    private GiaoDichTaiChinhRepository giaoDichRepo;
    @Mock
    private NhanVienRepository nhanVienRepo;
    @Mock
    private GiaoDichTaiChinhService giaoDichService;
    @Mock
    private TaiChinhConfig config;

    @InjectMocks
    private HopDongKyGuiTaiChinhService service;

    private BatDongSan createBds(Long id, Long chuNhaId) {
        return BatDongSan.builder()
                .id(id)
                .chuNha(ChuNha.builder().id(chuNhaId).build())
                .diaChi("123 Test St")
                .build();
    }

    private HopDongKyGui createHopDong(Long id, Long bdsId, Long chuNhaId, LocalDate ngayBatDau) {
        return HopDongKyGui.builder()
                .id(id)
                .batDongSan(createBds(bdsId, chuNhaId))
                .chuNha(ChuNha.builder().id(chuNhaId).hoTen("Chu Nha " + chuNhaId).build())
                .ngayBatDau(ngayBatDau)
                .trangThai("DANG_HOAT_DONG")
                .build();
    }

    @Test
    void quetHopDongDuDieuKienHoanTra_shouldReturnList_whenEligible() {
        when(config.getThoiHanKyGuiThang()).thenReturn(12);
        BatDongSan bds1 = createBds(1L, 1L);
        BatDongSan bds2 = createBds(2L, 2L);
        HopDongKyGui hd1 = HopDongKyGui.builder().id(1L)
                .batDongSan(bds1)
                .chuNha(ChuNha.builder().id(1L).hoTen("Chu Nha 1").build())
                .ngayBatDau(LocalDate.now().minusMonths(13))
                .trangThai("DANG_HOAT_DONG").build();
        HopDongKyGui hd2 = HopDongKyGui.builder().id(2L)
                .batDongSan(bds2)
                .chuNha(ChuNha.builder().id(2L).hoTen("Chu Nha 2").build())
                .ngayBatDau(LocalDate.now().minusMonths(14))
                .trangThai("DANG_HOAT_DONG").build();

        when(hopDongKyGuiRepo.findHopDongHetHan(any(), any())).thenReturn(List.of(hd1, hd2));
        when(hopDongThueRepo.existsByBatDongSanIdAndTrangThai(1L, "DANG_HOAT_DONG"))
                .thenReturn(false);
        when(hopDongThueRepo.existsByBatDongSanIdAndTrangThai(2L, "DANG_HOAT_DONG"))
                .thenReturn(false);
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "HOAN_TRA_DAM_BAO"))
                .thenReturn(false);
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(2L, "HOAN_TRA_DAM_BAO"))
                .thenReturn(false);

        List<HopDongKyGuiEligibleResponseDTO> result = service.quetHopDongDuDieuKienHoanTra();

        assertThat(result).hasSize(2);
    }

    @Test
    void quetHopDongDuDieuKienHoanTra_shouldReturnEmpty_whenNoneEligible() {
        when(config.getThoiHanKyGuiThang()).thenReturn(12);
        when(hopDongKyGuiRepo.findHopDongHetHan(any(), any())).thenReturn(List.of());

        List<HopDongKyGuiEligibleResponseDTO> result = service.quetHopDongDuDieuKienHoanTra();

        assertThat(result).isEmpty();
    }

    @Test
    void xuatLenhHoanTra_shouldReturn_whenSuccess() {
        YeuCauHoanTraRequestDTO dto = YeuCauHoanTraRequestDTO.builder()
                .hopDongKyGuiId(1L).lyDoChAmDut("Het han").build();
        NhanVien ketoan = NhanVien.builder().id(1L).hoTen("Ke Toan").build();
        BatDongSan bds = createBds(1L, 1L);
        HopDongKyGui hopDong = HopDongKyGui.builder().id(1L)
                .batDongSan(bds)
                .chuNha(ChuNha.builder().id(1L).hoTen("Chu Nha 1").build())
                .ngayBatDau(LocalDate.now().minusMonths(13))
                .trangThai("DANG_HOAT_DONG").build();
        GiaoDichTaiChinh savedGd = GiaoDichTaiChinh.builder().id(10L)
                .loaiGiaoDich("HOAN_TRA_DAM_BAO")
                .soTien(new BigDecimal("5000000"))
                .ngayGiaoDich(LocalDateTime.now())
                .trangThai("HOAN_THANH")
                .build();
        GiaoDichTaiChinhResponseDTO expectedDto = GiaoDichTaiChinhResponseDTO.builder()
                .id(10L).loaiGiaoDich("HOAN_TRA_DAM_BAO")
                .soTien(new BigDecimal("5000000")).trangThai("HOAN_THANH")
                .build();

        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));
        when(config.getThoiHanKyGuiThang()).thenReturn(12);
        when(hopDongKyGuiRepo.findHopDongHetHan(any(), any())).thenReturn(List.of(hopDong));
        when(hopDongThueRepo.existsByBatDongSanIdAndTrangThai(1L, "DANG_HOAT_DONG"))
                .thenReturn(false);
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "HOAN_TRA_DAM_BAO"))
                .thenReturn(false);
        when(config.getTienDamBao()).thenReturn(new BigDecimal("5000000"));
        when(giaoDichRepo.save(any())).thenReturn(savedGd);
        when(giaoDichService.toDTO(savedGd)).thenReturn(expectedDto);

        GiaoDichTaiChinhResponseDTO result = service.xuatLenhHoanTra(dto, "ke.toan");

        assertThat(result)
                .hasFieldOrPropertyWithValue("loaiGiaoDich", "HOAN_TRA_DAM_BAO")
                .hasFieldOrPropertyWithValue("trangThai", "HOAN_THANH");
        verify(hopDongKyGuiRepo).save(argThat(hd -> "DA_KET_THUC".equals(hd.getTrangThai())));
    }

    @Test
    void xuatLenhHoanTra_shouldThrow_whenNotEligible() {
        YeuCauHoanTraRequestDTO dto = YeuCauHoanTraRequestDTO.builder()
                .hopDongKyGuiId(1L).lyDoChAmDut("Het han").build();
        NhanVien ketoan = NhanVien.builder().id(1L).build();
        HopDongKyGui hopDong = HopDongKyGui.builder().id(1L)
                .batDongSan(createBds(1L, 1L)).build();

        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));
        when(config.getThoiHanKyGuiThang()).thenReturn(12);
        when(hopDongKyGuiRepo.findHopDongHetHan(any(), any())).thenReturn(List.of());

        assertThatThrownBy(() -> service.xuatLenhHoanTra(dto, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOP_DONG_CHUA_DU_DIEU_KIEN));
    }

    @Test
    void xuatLenhHoanTra_shouldThrow_whenAlreadyRefunded() {
        YeuCauHoanTraRequestDTO dto = YeuCauHoanTraRequestDTO.builder()
                .hopDongKyGuiId(1L).lyDoChAmDut("Het han").build();
        NhanVien ketoan = NhanVien.builder().id(1L).build();
        BatDongSan bds = createBds(1L, 1L);
        HopDongKyGui hopDong = HopDongKyGui.builder().id(1L)
                .batDongSan(bds)
                .chuNha(ChuNha.builder().id(1L).hoTen("Chu Nha").build())
                .ngayBatDau(LocalDate.now().minusMonths(13))
                .trangThai("DANG_HOAT_DONG").build();

        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));
        when(config.getThoiHanKyGuiThang()).thenReturn(12);
        when(hopDongKyGuiRepo.findHopDongHetHan(any(), any())).thenReturn(List.of(hopDong));
        when(hopDongThueRepo.existsByBatDongSanIdAndTrangThai(1L, "DANG_HOAT_DONG"))
                .thenReturn(false);
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "HOAN_TRA_DAM_BAO"))
                .thenReturn(false)
                .thenReturn(true);

        assertThatThrownBy(() -> service.xuatLenhHoanTra(dto, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.DA_HOAN_TRA));
    }
}
