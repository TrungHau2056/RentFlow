package com.rentflow.server.controller;

import com.rentflow.server.dto.request.HopDongThueRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.HopDongThueResponseDTO;
import com.rentflow.server.service.HopDongThueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hop-dong-thue")
@Validated
@RequiredArgsConstructor
public class HopDongThueController {
    private final HopDongThueService hopDongThueService;

    @PostMapping
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongThueResponseDTO> create(@RequestBody @Valid HopDongThueRequestDTO dto) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo hợp đồng thuê thành công")
                .data(hopDongThueService.create(dto))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<List<HopDongThueResponseDTO>> getAll(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) Long khachHangId) {
        return ApiSuccessResponse.<List<HopDongThueResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng thuê thành công")
                .data(hopDongThueService.getAll(trangThai, khachHangId))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<HopDongThueResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết hợp đồng thuê thành công")
                .data(hopDongThueService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongThueResponseDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid HopDongThueRequestDTO dto) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật hợp đồng thuê thành công")
                .data(hopDongThueService.update(id, dto))
                .build();
    }

    @PutMapping("/{id}/ky")
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongThueResponseDTO> kyHopDong(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Ký hợp đồng thuê thành công")
                .data(hopDongThueService.kyHopDong(id))
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasAuthority('BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<HopDongThueResponseDTO> updateTrangThai(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái hợp đồng thuê thành công")
                .data(hopDongThueService.updateTrangThai(id, body.get("trangThai")))
                .build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<List<HopDongThueResponseDTO>> getMyHopDong() {
        return ApiSuccessResponse.<List<HopDongThueResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng của tôi thành công")
                .data(hopDongThueService.getMyHopDong())
                .build();
    }
}