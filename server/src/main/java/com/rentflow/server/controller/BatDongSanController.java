package com.rentflow.server.controller;

import com.rentflow.server.dto.request.BatDongSanRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.BatDongSanResponseDTO;
import com.rentflow.server.service.BatDongSanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bat-dong-san")
@Validated
@RequiredArgsConstructor
@Tag(name = "02. Bất động sản (Admin)", description = "Quản lý bất động sản (nội bộ - nhân viên/quản trị viên)")
public class BatDongSanController {
    private final BatDongSanService batDongSanService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Danh sách bất động sản", description = "Lấy tất cả bất động sản (có thể lọc theo trạng thái)")
    public ApiSuccessResponse<List<BatDongSanResponseDTO>> getAll(
            @RequestParam(required = false) String trangThai) {
        return ApiSuccessResponse.<List<BatDongSanResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all properties successfully")
                .data(batDongSanService.getAll(trangThai))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Chi tiết bất động sản", description = "Lấy thông tin chi tiết bất động sản theo ID")
    public ApiSuccessResponse<BatDongSanResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get property successfully")
                .data(batDongSanService.getById(id))
                .build();
    }

    @GetMapping("/chu-nha/{chuNhaId}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    @Operation(summary = "Bất động sản theo chủ nhà", description = "Lấy danh sách bất động sản của một chủ nhà")
    public ApiSuccessResponse<List<BatDongSanResponseDTO>> getByChuNha(@PathVariable Long chuNhaId) {
        return ApiSuccessResponse.<List<BatDongSanResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get properties by landlord successfully")
                .data(batDongSanService.getByChuNha(chuNhaId))
                .build();
    }

    @GetMapping("/yeu-cau-moi")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Yêu cầu ký gửi mới", description = "Lấy danh sách bất động sản yêu cầu ký gửi mới (trạng thái YEU_CAU_KY_GUI)")
    public ApiSuccessResponse<List<BatDongSanResponseDTO>> getYeuCauMoi() {
        return ApiSuccessResponse.<List<BatDongSanResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get new consignment requests successfully")
                .data(batDongSanService.getYeuCauMoi())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CHU_NHA', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Thêm bất động sản", description = "Tạo mới bất động sản")
    public ApiSuccessResponse<BatDongSanResponseDTO> create(@RequestBody @Valid BatDongSanRequestDTO dto) {
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create property successfully")
                .data(batDongSanService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    @Operation(summary = "Cập nhật bất động sản", description = "Cập nhật thông tin bất động sản")
    public ApiSuccessResponse<BatDongSanResponseDTO> update(@PathVariable Long id,
                                                             @RequestBody @Valid BatDongSanRequestDTO dto) {
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update property successfully")
                .data(batDongSanService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_TRI_VIEN')")
    @Operation(summary = "Xoá bất động sản", description = "Xoá bất động sản (chỉ QUAN_TRI_VIEN)")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        batDongSanService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete property successfully")
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật trạng thái", description = "Cập nhật trạng thái bất động sản")
    public ApiSuccessResponse<BatDongSanResponseDTO> updateTrangThai(@PathVariable Long id,
                                                                      @RequestBody Map<String, String> body) {
        String trangThai = body.get("trangThai");
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update property status successfully")
                .data(batDongSanService.updateTrangThai(id, trangThai))
                .build();
    }
}