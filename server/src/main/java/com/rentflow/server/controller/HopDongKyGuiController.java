package com.rentflow.server.controller;

import com.rentflow.server.dto.request.HopDongKyGuiRequestDTO;
import com.rentflow.server.dto.request.PheDuyetRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.HopDongKyGuiResponseDTO;
import com.rentflow.server.service.HopDongKyGuiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hop-dong-ky-gui")
@Validated
@RequiredArgsConstructor
public class HopDongKyGuiController {
    private final HopDongKyGuiService hopDongKyGuiService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<List<HopDongKyGuiResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<HopDongKyGuiResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all consignment contracts successfully")
                .data(hopDongKyGuiService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT', 'CHU_NHA')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get consignment contract successfully")
                .data(hopDongKyGuiService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> create(@RequestBody @Valid HopDongKyGuiRequestDTO dto) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create consignment contract successfully")
                .data(hopDongKyGuiService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> update(@PathVariable Long id,
                                                               @RequestBody @Valid HopDongKyGuiRequestDTO dto) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update consignment contract successfully")
                .data(hopDongKyGuiService.update(id, dto))
                .build();
    }

    @PatchMapping("/{id}/gui-phe-duyet")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> guiPheDuyet(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Submit consignment contract for approval successfully")
                .data(hopDongKyGuiService.guiPheDuyet(id))
                .build();
    }

    @PatchMapping("/{id}/phe-duyet")
    @PreAuthorize("hasRole('BO_PHAN_PHAP_LUAT')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> pheDuyet(@PathVariable Long id,
                                                                 @RequestBody @Valid PheDuyetRequestDTO dto) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Approve consignment contract successfully")
                .data(hopDongKyGuiService.pheDuyet(id, dto))
                .build();
    }

    @PatchMapping("/{id}/ky-ket")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<HopDongKyGuiResponseDTO> kyKet(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongKyGuiResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Sign consignment contract successfully")
                .data(hopDongKyGuiService.kyKet(id))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_TRI_VIEN')")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        hopDongKyGuiService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete consignment contract successfully")
                .build();
    }
}