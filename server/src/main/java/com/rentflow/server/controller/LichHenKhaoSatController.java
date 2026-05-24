package com.rentflow.server.controller;

import com.rentflow.server.dto.request.KetQuaKhaoSatRequestDTO;
import com.rentflow.server.dto.request.LichHenKhaoSatRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.LichHenKhaoSatResponseDTO;
import com.rentflow.server.service.LichHenKhaoSatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lich-hen-khao-sat")
@Validated
@RequiredArgsConstructor
public class LichHenKhaoSatController {
    private final LichHenKhaoSatService lichHenKhaoSatService;

    @GetMapping
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<List<LichHenKhaoSatResponseDTO>> getAll() {
        return ApiSuccessResponse.<List<LichHenKhaoSatResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all survey appointments successfully")
                .data(lichHenKhaoSatService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('QUAN_TRI_VIEN', 'NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    public ApiSuccessResponse<LichHenKhaoSatResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<LichHenKhaoSatResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Get survey appointment successfully")
                .data(lichHenKhaoSatService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<LichHenKhaoSatResponseDTO> create(@RequestBody @Valid LichHenKhaoSatRequestDTO dto) {
        return ApiSuccessResponse.<LichHenKhaoSatResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Create survey appointment successfully")
                .data(lichHenKhaoSatService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<LichHenKhaoSatResponseDTO> update(@PathVariable Long id,
                                                                  @RequestBody @Valid LichHenKhaoSatRequestDTO dto) {
        return ApiSuccessResponse.<LichHenKhaoSatResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update survey appointment successfully")
                .data(lichHenKhaoSatService.update(id, dto))
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'CHU_NHA')")
    public ApiSuccessResponse<LichHenKhaoSatResponseDTO> updateTrangThai(@PathVariable Long id,
                                                                          @RequestBody Map<String, String> body) {
        String trangThai = body.get("trangThai");
        return ApiSuccessResponse.<LichHenKhaoSatResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Update appointment status successfully")
                .data(lichHenKhaoSatService.updateTrangThai(id, trangThai))
                .build();
    }

    @PatchMapping("/{id}/ket-qua")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    public ApiSuccessResponse<LichHenKhaoSatResponseDTO> ghiNhanKetQua(@PathVariable Long id,
                                                                        @RequestBody @Valid KetQuaKhaoSatRequestDTO dto) {
        return ApiSuccessResponse.<LichHenKhaoSatResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Record survey result successfully")
                .data(lichHenKhaoSatService.ghiNhanKetQua(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('QUAN_TRI_VIEN')")
    public ApiSuccessResponse<Void> delete(@PathVariable Long id) {
        lichHenKhaoSatService.delete(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Delete survey appointment successfully")
                .build();
    }
}