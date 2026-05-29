package com.rentflow.server.controller;

import com.rentflow.server.dto.request.KhachHangRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.KhachHangResponseDTO;
import com.rentflow.server.service.KhachHangService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "05. Khách hàng", description = "Quản lý thông tin khách hàng thuê nhà")
public class KhachHangController {
    private final KhachHangService khachHangService;

    @GetMapping
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Danh sách khách hàng", description = "Lấy tất cả khách hàng")
    public ApiSuccessResponse<List<KhachHangResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<KhachHangResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách khách hàng thành công")
                .data(khachHangService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT', 'KHACH_HANG')")
    @Operation(summary = "Chi tiết khách hàng", description = "Lấy thông tin khách hàng theo ID")
    public ApiSuccessResponse<KhachHangResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<KhachHangResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin khách hàng thành công")
                .data(khachHangService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật khách hàng", description = "Cập nhật thông tin khách hàng")
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
    @PreAuthorize("hasRole('KHACH_HANG')")
    @Operation(summary = "Cập nhật nhu cầu", description = "Cập nhật nhu cầu tìm nhà của khách hàng")
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
    @PreAuthorize("hasRole('BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Xoá khách hàng", description = "Xoá khách hàng (chỉ BO_PHAN_PHAP_LUAT)")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        khachHangService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa khách hàng thành công")
                .build();
    }
}
