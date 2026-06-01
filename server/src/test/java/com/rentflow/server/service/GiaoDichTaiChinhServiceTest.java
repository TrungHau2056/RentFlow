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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GiaoDichTaiChinhServiceTest {

    @Mock
    private GiaoDichTaiChinhRepository giaoDichRepo;
    @Mock
    private HopDongKyGuiRepository hopDongKyGuiRepo;
    @Mock
    private NhanVienRepository nhanVienRepo;
    @Mock
    private TaiChinhConfig config;

    @InjectMocks
    private GiaoDichTaiChinhService service;

    @Test
    void ghiNhanTienDamBao_shouldReturn_whenSuccess() {
        GhiNhanThuRequestDTO dto = GhiNhanThuRequestDTO.builder().hopDongKyGuiId(1L).build();
        NhanVien ketoan = NhanVien.builder().id(1L).hoTen("Ke Toan").build();
        HopDongKyGui hopDong = HopDongKyGui.builder()
                .id(1L).trangThai("DANG_HOAT_DONG").build();
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "TIEN_DAM_BAO"))
                .thenReturn(false);
        when(config.getTienDamBao()).thenReturn(new BigDecimal("5000000"));
        when(giaoDichRepo.save(any())).thenAnswer(i -> {
            GiaoDichTaiChinh g = i.getArgument(0);
            return GiaoDichTaiChinh.builder()
                    .id(1L)
                    .nhanVienKeToan(g.getNhanVienKeToan())
                    .hopDongKyGui(g.getHopDongKyGui())
                    .loaiGiaoDich(g.getLoaiGiaoDich())
                    .soTien(g.getSoTien())
                    .ngayGiaoDich(g.getNgayGiaoDich())
                    .trangThai(g.getTrangThai())
                    .build();
        });

        GiaoDichTaiChinhResponseDTO result = service.ghiNhanTienDamBao(dto, "ke.toan");

        assertThat(result)
                .hasFieldOrPropertyWithValue("loaiGiaoDich", "TIEN_DAM_BAO")
                .hasFieldOrPropertyWithValue("trangThai", "CHO_XU_LY")
                .satisfies(r -> assertThat(r.getSoTien()).isEqualByComparingTo("5000000"));
    }

    @Test
    void ghiNhanTienDamBao_shouldThrow_whenEmployeeNotFound() {
        GhiNhanThuRequestDTO dto = GhiNhanThuRequestDTO.builder().hopDongKyGuiId(1L).build();
        when(nhanVienRepo.findByTaiKhoanUsername("invalid")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.ghiNhanTienDamBao(dto, "invalid"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.NHAN_VIEN_NOT_FOUND));
    }

    @Test
    void ghiNhanTienDamBao_shouldThrow_whenContractInvalidStatus() {
        GhiNhanThuRequestDTO dto = GhiNhanThuRequestDTO.builder().hopDongKyGuiId(1L).build();
        NhanVien ketoan = NhanVien.builder().id(1L).build();
        HopDongKyGui hopDong = HopDongKyGui.builder()
                .id(1L).trangThai("DA_KET_THUC").build();
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));

        assertThatThrownBy(() -> service.ghiNhanTienDamBao(dto, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.HOP_DONG_KHONG_HOP_LE));
    }

    @Test
    void ghiNhanTienDamBao_shouldThrow_whenDepositAlreadyRecorded() {
        GhiNhanThuRequestDTO dto = GhiNhanThuRequestDTO.builder().hopDongKyGuiId(1L).build();
        NhanVien ketoan = NhanVien.builder().id(1L).build();
        HopDongKyGui hopDong = HopDongKyGui.builder()
                .id(1L).trangThai("DANG_HOAT_DONG").build();
        when(nhanVienRepo.findByTaiKhoanUsername("ke.toan")).thenReturn(Optional.of(ketoan));
        when(hopDongKyGuiRepo.findById(1L)).thenReturn(Optional.of(hopDong));
        when(giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(1L, "TIEN_DAM_BAO"))
                .thenReturn(true);

        assertThatThrownBy(() -> service.ghiNhanTienDamBao(dto, "ke.toan"))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TIEN_DAM_BAO_DA_THU));
    }

    @Test
    void layDanhSachGiaoDich_shouldReturnAll_whenNoFilter() {
        when(giaoDichRepo.findAll()).thenReturn(List.of(
                GiaoDichTaiChinh.builder().id(1L).loaiGiaoDich("TIEN_DAM_BAO").soTien(BigDecimal.TEN).build(),
                GiaoDichTaiChinh.builder().id(2L).loaiGiaoDich("HOA_HONG").soTien(BigDecimal.ONE).build()));

        List<GiaoDichTaiChinhResponseDTO> result = service.layDanhSachGiaoDich(null);

        assertThat(result).hasSize(2);
    }

    @Test
    void layDanhSachGiaoDich_shouldReturnFiltered_whenFilterByType() {
        when(giaoDichRepo.findByLoaiGiaoDich("HOA_HONG")).thenReturn(List.of(
                GiaoDichTaiChinh.builder().id(1L).loaiGiaoDich("HOA_HONG").soTien(BigDecimal.TEN).build()));

        List<GiaoDichTaiChinhResponseDTO> result = service.layDanhSachGiaoDich("HOA_HONG");

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).hasFieldOrPropertyWithValue("loaiGiaoDich", "HOA_HONG");
    }

    @Test
    void layChiTietGiaoDich_shouldThrow_whenNotFound() {
        when(giaoDichRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.layChiTietGiaoDich(99L))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.GIAO_DICH_NOT_FOUND));
    }
}
