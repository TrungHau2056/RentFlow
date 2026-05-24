package com.rentflow.server.service;

import com.rentflow.server.dto.request.DoiTrangThaiTaiKhoanRequestDTO;
import com.rentflow.server.dto.request.DoiVaiTroRequestDTO;
import com.rentflow.server.dto.request.TaoNhanVienRequestDTO;
import com.rentflow.server.dto.response.quantri.TaiKhoanNhanVienResponseDTO;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.entity.VaiTro;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.repository.TaiKhoanRepository;
import com.rentflow.server.repository.VaiTroRepository;
import com.rentflow.server.util.enums.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuanTriTaiKhoanServiceTest {

    @Mock
    private TaiKhoanRepository taiKhoanRepo;
    @Mock
    private NhanVienRepository nhanVienRepo;
    @Mock
    private VaiTroRepository vaiTroRepo;

    @InjectMocks
    private QuanTriTaiKhoanService service;

    private VaiTro createVaiTro(Long id, String ten) {
        return VaiTro.builder().id(id).tenVaiTro(ten).build();
    }

    private TaiKhoan createTaiKhoan(Long id, String username, String trangThai, VaiTro vaiTro) {
        return TaiKhoan.builder()
                .id(id).username(username).trangThai(trangThai).vaiTro(vaiTro)
                .build();
    }

    @Test
    void layDanhSach_shouldReturnList() {
        VaiTro vaiTro = createVaiTro(1L, "MOI_GIOI");
        List<TaiKhoan> accounts = List.of(
                createTaiKhoan(1L, "user1", "ACTIVE", vaiTro),
                createTaiKhoan(2L, "user2", "ACTIVE", vaiTro),
                createTaiKhoan(3L, "user3", "LOCKED", vaiTro));
        when(taiKhoanRepo.findByVaiTroIn(any())).thenReturn(accounts);
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).hoTen("A").email("a@test.com").build()));
        when(nhanVienRepo.findByTaiKhoanId(2L)).thenReturn(Optional.of(
                NhanVien.builder().id(20L).hoTen("B").email("b@test.com").build()));
        when(nhanVienRepo.findByTaiKhoanId(3L)).thenReturn(Optional.empty());

        List<TaiKhoanNhanVienResponseDTO> result = service.layDanhSach();

        assertThat(result).hasSize(3);
    }

    @Test
    void layDanhSach_shouldReturnEmpty_whenNoInternalAccounts() {
        when(taiKhoanRepo.findByVaiTroIn(any())).thenReturn(List.of());

        List<TaiKhoanNhanVienResponseDTO> result = service.layDanhSach();

        assertThat(result).isEmpty();
    }

    @Test
    void layChiTiet_shouldReturn_whenFound() {
        VaiTro vaiTro = createVaiTro(1L, "KE_TOAN");
        TaiKhoan taiKhoan = createTaiKhoan(1L, "user1", "ACTIVE", vaiTro);
        when(taiKhoanRepo.findById(1L)).thenReturn(Optional.of(taiKhoan));
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).hoTen("A").email("a@test.com").chucVu("KE_TOAN").build()));

        TaiKhoanNhanVienResponseDTO result = service.layChiTiet(1L);

        assertThat(result)
                .hasFieldOrPropertyWithValue("id", 1L)
                .hasFieldOrPropertyWithValue("username", "user1")
                .hasFieldOrPropertyWithValue("tenVaiTro", "KE_TOAN")
                .hasFieldOrPropertyWithValue("nhanVienId", 10L);
    }

    @Test
    void layChiTiet_shouldThrow_whenNotFound() {
        when(taiKhoanRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.layChiTiet(99L))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TAI_KHOAN_NOT_FOUND));
    }

    @Test
    void layChiTiet_shouldThrow_whenRoleNotInternal() {
        VaiTro vaiTro = createVaiTro(2L, "KHACH_HANG");
        TaiKhoan taiKhoan = createTaiKhoan(1L, "user1", "ACTIVE", vaiTro);
        when(taiKhoanRepo.findById(1L)).thenReturn(Optional.of(taiKhoan));

        assertThatThrownBy(() -> service.layChiTiet(1L))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TAI_KHOAN_NOT_FOUND));
    }

    @Test
    void taoTaiKhoan_shouldReturn_whenSuccess() {
        TaoNhanVienRequestDTO dto = TaoNhanVienRequestDTO.builder()
                .username("newuser").password("pass123")
                .tenVaiTro("MOI_GIOI").hoTen("Nguyen Van A")
                .email("a@test.com").soDienThoai("0123456789")
                .build();
        VaiTro vaiTro = createVaiTro(1L, "MOI_GIOI");
        when(taiKhoanRepo.existsByUsername("newuser")).thenReturn(false);
        when(vaiTroRepo.findByTenVaiTro("MOI_GIOI")).thenReturn(Optional.of(vaiTro));
        TaiKhoan saved = createTaiKhoan(1L, "newuser", "ACTIVE", vaiTro);
        when(taiKhoanRepo.save(any())).thenReturn(saved);
        when(nhanVienRepo.save(any())).thenReturn(
                NhanVien.builder().id(10L).hoTen("Nguyen Van A").build());
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).hoTen("Nguyen Van A")
                        .email("a@test.com").soDienThoai("0123456789")
                        .chucVu("MOI_GIOI").build()));

        TaiKhoanNhanVienResponseDTO result = service.taoTaiKhoan(dto);

        assertThat(result)
                .hasFieldOrPropertyWithValue("username", "newuser")
                .hasFieldOrPropertyWithValue("tenVaiTro", "MOI_GIOI")
                .hasFieldOrPropertyWithValue("nhanVienId", 10L);
        verify(taiKhoanRepo, times(1)).save(any());
        verify(nhanVienRepo, times(1)).save(any());
    }

    @Test
    void taoTaiKhoan_shouldThrow_whenUsernameExists() {
        TaoNhanVienRequestDTO dto = TaoNhanVienRequestDTO.builder()
                .username("existing").password("pass123")
                .tenVaiTro("MOI_GIOI").hoTen("A").email("a@test.com").build();
        when(taiKhoanRepo.existsByUsername("existing")).thenReturn(true);

        assertThatThrownBy(() -> service.taoTaiKhoan(dto))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.USERNAME_DA_TON_TAI));
    }

    @Test
    void taoTaiKhoan_shouldThrow_whenInvalidRole() {
        TaoNhanVienRequestDTO dto = TaoNhanVienRequestDTO.builder()
                .username("newuser").password("pass123")
                .tenVaiTro("KHACH_HANG").hoTen("A").email("a@test.com").build();
        when(taiKhoanRepo.existsByUsername("newuser")).thenReturn(false);

        assertThatThrownBy(() -> service.taoTaiKhoan(dto))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.VAI_TRO_KHONG_HOP_LE));
    }

    @Test
    void taoTaiKhoan_shouldThrow_whenRoleNotFound() {
        TaoNhanVienRequestDTO dto = TaoNhanVienRequestDTO.builder()
                .username("newuser").password("pass123")
                .tenVaiTro("MOI_GIOI").hoTen("A").email("a@test.com").build();
        when(taiKhoanRepo.existsByUsername("newuser")).thenReturn(false);
        when(vaiTroRepo.findByTenVaiTro("MOI_GIOI")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.taoTaiKhoan(dto))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.VAI_TRO_NOT_FOUND));
    }

    @Test
    void doiTrangThai_shouldReturn_whenSuccess() {
        DoiTrangThaiTaiKhoanRequestDTO dto = DoiTrangThaiTaiKhoanRequestDTO.builder()
                .trangThai("LOCKED").build();
        VaiTro vaiTro = createVaiTro(1L, "MOI_GIOI");
        TaiKhoan taiKhoan = createTaiKhoan(1L, "user1", "ACTIVE", vaiTro);
        when(taiKhoanRepo.findById(1L)).thenReturn(Optional.of(taiKhoan));
        when(taiKhoanRepo.save(any())).thenAnswer(i -> i.getArgument(0));
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).hoTen("A").build()));

        TaiKhoanNhanVienResponseDTO result = service.doiTrangThai(1L, dto);

        assertThat(result).hasFieldOrPropertyWithValue("trangThai", "LOCKED");
    }

    @Test
    void doiTrangThai_shouldThrow_whenInvalidStatus() {
        DoiTrangThaiTaiKhoanRequestDTO dto = DoiTrangThaiTaiKhoanRequestDTO.builder()
                .trangThai("BANNED").build();

        assertThatThrownBy(() -> service.doiTrangThai(1L, dto))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TRANG_THAI_KHONG_HOP_LE));
    }

    @Test
    void doiVaiTro_shouldReturn_whenSuccess() {
        DoiVaiTroRequestDTO dto = DoiVaiTroRequestDTO.builder().tenVaiTro("KE_TOAN").build();
        VaiTro vaiTroCu = createVaiTro(1L, "MOI_GIOI");
        VaiTro vaiTroMoi = createVaiTro(2L, "KE_TOAN");
        TaiKhoan taiKhoan = createTaiKhoan(1L, "user1", "ACTIVE", vaiTroCu);
        when(taiKhoanRepo.findById(1L)).thenReturn(Optional.of(taiKhoan));
        when(vaiTroRepo.findByTenVaiTro("KE_TOAN")).thenReturn(Optional.of(vaiTroMoi));
        when(taiKhoanRepo.save(any())).thenAnswer(i -> i.getArgument(0));
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).hoTen("A").chucVu("MOI_GIOI").build()));

        TaiKhoanNhanVienResponseDTO result = service.doiVaiTro(1L, dto);

        assertThat(result).hasFieldOrPropertyWithValue("tenVaiTro", "KE_TOAN");
        verify(nhanVienRepo).save(argThat(nv -> "KE_TOAN".equals(nv.getChucVu())));
    }

    @Test
    void xoaTaiKhoan_shouldDelete_whenFound() {
        VaiTro vaiTro = createVaiTro(1L, "MOI_GIOI");
        TaiKhoan taiKhoan = createTaiKhoan(1L, "user1", "ACTIVE", vaiTro);
        when(taiKhoanRepo.findById(1L)).thenReturn(Optional.of(taiKhoan));
        when(nhanVienRepo.findByTaiKhoanId(1L)).thenReturn(Optional.of(
                NhanVien.builder().id(10L).build()));

        service.xoaTaiKhoan(1L);

        verify(nhanVienRepo, times(1)).delete(any());
        verify(taiKhoanRepo, times(1)).delete(any());
    }

    @Test
    void xoaTaiKhoan_shouldThrow_whenNotFound() {
        when(taiKhoanRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.xoaTaiKhoan(99L))
                .isInstanceOf(AppException.class)
                .satisfies(e -> assertThat(((AppException) e).getErrorCode())
                        .isEqualTo(ErrorCode.TAI_KHOAN_NOT_FOUND));
    }
}
