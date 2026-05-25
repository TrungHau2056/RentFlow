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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuanTriTaiKhoanService {

    private static final Set<String> VAI_TRO_NOI_BO = Set.of(
            "QUAN_TRI_VIEN", "MOI_GIOI", "KE_TOAN", "NHAN_VIEN_DAI_LY", "BO_PHAN_PHAP_LUAT"
    );
    private static final List<String> VAI_TRO_NOI_BO_LIST = List.copyOf(VAI_TRO_NOI_BO);
    private static final Set<String> TRANG_THAI_HOP_LE = Set.of("ACTIVE", "LOCKED");

    private final TaiKhoanRepository taiKhoanRepo;
    private final NhanVienRepository nhanVienRepo;
    private final VaiTroRepository vaiTroRepo;

    public List<TaiKhoanNhanVienResponseDTO> layDanhSach() {
        return taiKhoanRepo.findByVaiTroIn(VAI_TRO_NOI_BO_LIST).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TaiKhoanNhanVienResponseDTO layChiTiet(Long id) {
        TaiKhoan taiKhoan = taiKhoanRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND));
        if (!VAI_TRO_NOI_BO.contains(taiKhoan.getVaiTro().getTenVaiTro())) {
            throw new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND);
        }
        return toDTO(taiKhoan);
    }

    @Transactional
    public TaiKhoanNhanVienResponseDTO taoTaiKhoan(TaoNhanVienRequestDTO dto) {
        if (taiKhoanRepo.existsByUsername(dto.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_DA_TON_TAI);
        }
        if (!VAI_TRO_NOI_BO.contains(dto.getTenVaiTro())) {
            throw new AppException(ErrorCode.VAI_TRO_KHONG_HOP_LE);
        }
        VaiTro vaiTro = vaiTroRepo.findByTenVaiTro(dto.getTenVaiTro())
                .orElseThrow(() -> new AppException(ErrorCode.VAI_TRO_NOT_FOUND));

        TaiKhoan taiKhoan = TaiKhoan.builder()
                .username(dto.getUsername())
                .passwordHash(dto.getPassword())
                .trangThai("ACTIVE")
                .vaiTro(vaiTro)
                .build();
        taiKhoan = taiKhoanRepo.save(taiKhoan);

        NhanVien nhanVien = NhanVien.builder()
                .taiKhoan(taiKhoan)
                .hoTen(dto.getHoTen())
                .email(dto.getEmail())
                .soDienThoai(dto.getSoDienThoai())
                .chucVu(dto.getTenVaiTro())
                .build();
        nhanVienRepo.save(nhanVien);

        return toDTO(taiKhoan);
    }

    @Transactional
    public TaiKhoanNhanVienResponseDTO doiTrangThai(Long id, DoiTrangThaiTaiKhoanRequestDTO dto) {
        if (!TRANG_THAI_HOP_LE.contains(dto.getTrangThai())) {
            throw new AppException(ErrorCode.TRANG_THAI_KHONG_HOP_LE);
        }
        TaiKhoan taiKhoan = taiKhoanRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND));
        if (!VAI_TRO_NOI_BO.contains(taiKhoan.getVaiTro().getTenVaiTro())) {
            throw new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND);
        }
        taiKhoan.setTrangThai(dto.getTrangThai());
        taiKhoan = taiKhoanRepo.save(taiKhoan);
        return toDTO(taiKhoan);
    }

    @Transactional
    public TaiKhoanNhanVienResponseDTO doiVaiTro(Long id, DoiVaiTroRequestDTO dto) {
        if (!VAI_TRO_NOI_BO.contains(dto.getTenVaiTro())) {
            throw new AppException(ErrorCode.VAI_TRO_KHONG_HOP_LE);
        }
        TaiKhoan taiKhoan = taiKhoanRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND));
        if (!VAI_TRO_NOI_BO.contains(taiKhoan.getVaiTro().getTenVaiTro())) {
            throw new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND);
        }
        VaiTro vaiTroMoi = vaiTroRepo.findByTenVaiTro(dto.getTenVaiTro())
                .orElseThrow(() -> new AppException(ErrorCode.VAI_TRO_NOT_FOUND));

        taiKhoan.setVaiTro(vaiTroMoi);
        taiKhoanRepo.save(taiKhoan);

        nhanVienRepo.findByTaiKhoanId(id).ifPresent(nv -> {
            nv.setChucVu(dto.getTenVaiTro());
            nhanVienRepo.save(nv);
        });

        return toDTO(taiKhoan);
    }

    @Transactional
    public void xoaTaiKhoan(Long id) {
        TaiKhoan taiKhoan = taiKhoanRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND));
        if (!VAI_TRO_NOI_BO.contains(taiKhoan.getVaiTro().getTenVaiTro())) {
            throw new AppException(ErrorCode.TAI_KHOAN_NOT_FOUND);
        }
        nhanVienRepo.findByTaiKhoanId(id).ifPresent(nhanVienRepo::delete);
        taiKhoanRepo.delete(taiKhoan);
    }

    private TaiKhoanNhanVienResponseDTO toDTO(TaiKhoan taiKhoan) {
        NhanVien nv = nhanVienRepo.findByTaiKhoanId(taiKhoan.getId()).orElse(null);
        return TaiKhoanNhanVienResponseDTO.builder()
                .id(taiKhoan.getId())
                .username(taiKhoan.getUsername())
                .trangThai(taiKhoan.getTrangThai())
                .tenVaiTro(taiKhoan.getVaiTro().getTenVaiTro())
                .nhanVienId(nv != null ? nv.getId() : null)
                .hoTen(nv != null ? nv.getHoTen() : null)
                .email(nv != null ? nv.getEmail() : null)
                .soDienThoai(nv != null ? nv.getSoDienThoai() : null)
                .chucVu(nv != null ? nv.getChucVu() : null)
                .build();
    }
}
