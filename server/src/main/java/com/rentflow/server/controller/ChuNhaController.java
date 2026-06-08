package com.rentflow.server.controller;

import com.rentflow.server.dto.request.ChuNhaRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.ChuNhaResponseDTO;
import com.rentflow.server.service.ChuNhaService;
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
@RequestMapping("/api/chu-nha")
@Validated
@RequiredArgsConstructor
@Tag(name = "04. Chủ nhà", description = "Quản lý thông tin chủ nhà")
public class ChuNhaController {
    private final ChuNhaService chuNhaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Danh sách chủ nhà", description = "Lấy tất cả chủ nhà")
    public ApiSuccessResponse<List<ChuNhaResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<ChuNhaResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all landlords successfully")
                .data(chuNhaService.getAll())
                .build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CHU_NHA')")
    @Operation(summary = "Chủ nhà hiện tại", description = "Lấy thông tin chủ nhà của người dùng đang đăng nhập")
    public ApiSuccessResponse<ChuNhaResponseDTO> getCurrent() {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get current landlord successfully")
                .data(chuNhaService.getCurrentChuNha())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    @Operation(summary = "Chi tiết chủ nhà", description = "Lấy thông tin chủ nhà theo ID")
    public ApiSuccessResponse<ChuNhaResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get landlord successfully")
                .data(chuNhaService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Thêm chủ nhà", description = "Tạo mới chủ nhà")
    public ApiSuccessResponse<ChuNhaResponseDTO> create(@RequestBody @Valid ChuNhaRequestDTO dto) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create landlord successfully")
                .data(chuNhaService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật chủ nhà", description = "Cập nhật thông tin chủ nhà")
    public ApiSuccessResponse<ChuNhaResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ChuNhaRequestDTO dto) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update landlord successfully")
                .data(chuNhaService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_TRI_VIEN')")
    @Operation(summary = "Xoá chủ nhà", description = "Xoá chủ nhà (chỉ QUAN_TRI_VIEN)")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        chuNhaService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete landlord successfully")
                .build();
    }
}