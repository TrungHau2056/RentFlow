package com.rentflow.server.controller;

import com.rentflow.server.dto.request.KhachHangRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.KhachHangResponseDTO;
import com.rentflow.server.service.KhachHangService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
@Validated
@RequiredArgsConstructor
public class KhachHangController {
    private final KhachHangService khachHangService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<List<KhachHangResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<KhachHangResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách khách hàng thành công")
                .data(khachHangService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT', 'KHACH_HANG')")
    public ApiSuccessResponse<KhachHangResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<KhachHangResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin khách hàng thành công")
                .data(khachHangService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('KHACH_HANG', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<KhachHangResponseDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid KhachHangRequestDTO dto) {
        return ApiSuccessResponse.<KhachHangResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông tin khách hàng thành công")
                .data(khachHangService.update(id, dto))
                .build();
    }

    @PutMapping("/{id}/nhu-cau")
    @PreAuthorize("hasAuthority('KHACH_HANG')")
    public ApiSuccessResponse<KhachHangResponseDTO> updateNhuCau(
            @PathVariable Long id,
            @RequestBody @Valid KhachHangRequestDTO dto) {
        return ApiSuccessResponse.<KhachHangResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật nhu cầu tìm nhà thành công")
                .data(khachHangService.updateNhuCau(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        khachHangService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa khách hàng thành công")
                .build();
    }
}