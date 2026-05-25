package com.rentflow.server.controller;

import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.KhachHangResponseDTO;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien-moi-gioi")
@Validated
@RequiredArgsConstructor
@Tag(name = "10. Nhân viên môi giới", description = "Quản lý phân công khách hàng cho nhân viên môi giới")
public class NhanVienMoiGioiController {
    private final NhanVienRepository nhanVienRepository;
    private final KhachHangRepository khachHangRepository;

    @PostMapping("/{id}/khach-hang")
    @PreAuthorize("hasAnyAuthority('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Phân công khách hàng", description = "Phân công khách hàng cho nhân viên môi giới")
    public ApiSuccessResponse<Void> assignKhachHang(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        NhanVien nv = nhanVienRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        Long khachHangId = body.get("khachHangId");
        KhachHang kh = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        kh.setNhanVienMoiGioi(nv);
        khachHangRepository.save(kh);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Phân công khách hàng cho nhân viên môi giới thành công")
                .build();
    }

    @GetMapping("/{id}/khach-hang")
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "DS khách hàng được phân công", description = "Lấy danh sách khách hàng đã phân công cho nhân viên")
    public ApiSuccessResponse<List<KhachHangResponseDTO>> getAssignedKhachHang(@PathVariable Long id) {
        NhanVien nv = nhanVienRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        List<KhachHang> list = khachHangRepository.findByNhanVienMoiGioiId(id);
        List<KhachHangResponseDTO> dtos = list.stream().map(kh -> KhachHangResponseDTO.builder()
                .id(kh.getId())
                .hoTen(kh.getHoTen())
                .soDienThoai(kh.getSoDienThoai())
                .email(kh.getEmail())
                .nhuCauThue(kh.getNhuCauThue())
                .tieuChiTimNha(kh.getTieuChiTimNha())
                .nhuCauThueChiTiet(kh.getNhuCauThueChiTiet())
                .build()).toList();
        return ApiSuccessResponse.<List<KhachHangResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách khách hàng đã phân công thành công")
                .data(dtos)
                .build();
    }

    @DeleteMapping("/{nhanVienId}/khach-hang/{khachHangId}")
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Huỷ phân công", description = "Huỷ phân công khách hàng khỏi nhân viên môi giới")
    public ApiSuccessResponse<Void> removeAssign(
            @PathVariable Long nhanVienId,
            @PathVariable Long khachHangId) {
        KhachHang kh = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        if (kh.getNhanVienMoiGioi() == null || !kh.getNhanVienMoiGioi().getId().equals(nhanVienId)) {
            throw new AppException(ErrorCode.KHACH_HANG_NOT_FOUND);
        }
        kh.setNhanVienMoiGioi(null);
        khachHangRepository.save(kh);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Hủy phân công khách hàng thành công")
                .build();
    }
}