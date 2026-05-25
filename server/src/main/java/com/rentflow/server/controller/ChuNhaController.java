package com.rentflow.server.controller;

import com.rentflow.server.dto.request.ChuNhaRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.ChuNhaResponseDTO;
import com.rentflow.server.service.ChuNhaService;
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
public class ChuNhaController {
    private final ChuNhaService chuNhaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<List<ChuNhaResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<ChuNhaResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all landlords successfully")
                .data(chuNhaService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    public ApiSuccessResponse<ChuNhaResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get landlord successfully")
                .data(chuNhaService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<ChuNhaResponseDTO> create(@RequestBody @Valid ChuNhaRequestDTO dto) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create landlord successfully")
                .data(chuNhaService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<ChuNhaResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ChuNhaRequestDTO dto) {
        return ApiSuccessResponse.<ChuNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update landlord successfully")
                .data(chuNhaService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_TRI_VIEN')")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        chuNhaService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete landlord successfully")
                .build();
    }
}