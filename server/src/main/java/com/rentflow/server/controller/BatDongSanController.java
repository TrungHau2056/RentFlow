package com.rentflow.server.controller;

import com.rentflow.server.dto.request.BatDongSanRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.BatDongSanResponseDTO;
import com.rentflow.server.service.BatDongSanService;
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
public class BatDongSanController {
    private final BatDongSanService batDongSanService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
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
    public ApiSuccessResponse<BatDongSanResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get property successfully")
                .data(batDongSanService.getById(id))
                .build();
    }

    @GetMapping("/chu-nha/{chuNhaId}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    public ApiSuccessResponse<List<BatDongSanResponseDTO>> getByChuNha(@PathVariable Long chuNhaId) {
        return ApiSuccessResponse.<List<BatDongSanResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get properties by landlord successfully")
                .data(batDongSanService.getByChuNha(chuNhaId))
                .build();
    }

    @GetMapping("/yeu-cau-moi")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<List<BatDongSanResponseDTO>> getYeuCauMoi() {
        return ApiSuccessResponse.<List<BatDongSanResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get new consignment requests successfully")
                .data(batDongSanService.getYeuCauMoi())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CHU_NHA', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<BatDongSanResponseDTO> create(@RequestBody @Valid BatDongSanRequestDTO dto) {
        return ApiSuccessResponse.<BatDongSanResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create property successfully")
                .data(batDongSanService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
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
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        batDongSanService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete property successfully")
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
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