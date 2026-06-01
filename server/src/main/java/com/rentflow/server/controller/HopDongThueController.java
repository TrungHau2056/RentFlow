package com.rentflow.server.controller;

import com.rentflow.server.dto.request.HopDongThueRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.HopDongThueEligibilityResponseDTO;
import com.rentflow.server.dto.response.HopDongThueResponseDTO;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.service.HopDongThueService;
import com.rentflow.server.util.enums.ErrorCode;
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
import java.time.LocalDate;

@RestController
@RequestMapping("/api/hop-dong-thue")
@Validated
@RequiredArgsConstructor
@Tag(name = "07. Hợp đồng thuê", description = "Quản lý hợp đồng thuê nhà")
public class HopDongThueController {
    private final HopDongThueService hopDongThueService;

    @PostMapping
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Tạo hợp đồng thuê", description = "Tạo mới hợp đồng thuê nhà")
    public ApiSuccessResponse<HopDongThueResponseDTO> create(@RequestBody @Valid HopDongThueRequestDTO dto) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo hợp đồng thuê thành công")
                .data(hopDongThueService.create(dto))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Danh sách hợp đồng thuê", description = "Lấy tất cả hợp đồng thuê (có thể lọc theo trạng thái, khách hàng)")
    public ApiSuccessResponse<List<HopDongThueResponseDTO>> getAll(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) Long khachHangId) {
        return ApiSuccessResponse.<List<HopDongThueResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng thuê thành công")
                .data(hopDongThueService.getAll(trangThai, khachHangId))
                .build();
    }

    @GetMapping("/eligible")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Kiểm tra điều kiện lập hợp đồng thuê", description = "Kiểm tra lịch xem, khách hàng, bất động sản, môi giới và trạng thái trước khi lập hợp đồng")
    public ApiSuccessResponse<HopDongThueEligibilityResponseDTO> checkEligibility(
            @RequestParam(required = false) Long lichXemId,
            @RequestParam(required = false) Long khachHangId,
            @RequestParam(required = false) Long batDongSanId,
            @RequestParam(required = false) Long nhanVienMoiGioiId) {
        return ApiSuccessResponse.<HopDongThueEligibilityResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Kiểm tra điều kiện lập hợp đồng thuê thành công")
                .data(hopDongThueService.checkEligibility(lichXemId, khachHangId, batDongSanId, nhanVienMoiGioiId))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Chi tiết hợp đồng thuê", description = "Lấy chi tiết hợp đồng thuê theo ID")
    public ApiSuccessResponse<HopDongThueResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết hợp đồng thuê thành công")
                .data(hopDongThueService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật hợp đồng thuê", description = "Cập nhật thông tin hợp đồng thuê")
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
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Ký hợp đồng thuê", description = "Ký kết hợp đồng thuê")
    public ApiSuccessResponse<HopDongThueResponseDTO> kyHopDong(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        LocalDate ngayKy = null;
        if (body != null && body.get("ngayKy") != null && !body.get("ngayKy").isBlank()) {
            try {
                ngayKy = LocalDate.parse(body.get("ngayKy"));
            } catch (RuntimeException e) {
                throw new AppException(ErrorCode.INVALID_HOP_DONG);
            }
        }
        return ApiSuccessResponse.<HopDongThueResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Ký hợp đồng thuê thành công")
                .data(hopDongThueService.kyHopDong(id, ngayKy))
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasRole('BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Cập nhật trạng thái hợp đồng thuê", description = "Cập nhật trạng thái hợp đồng thuê (chỉ BO_PHAN_PHAP_LUAT)")
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
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Hợp đồng của tôi", description = "Khách hàng xem hợp đồng của mình hoặc nhân viên xem hợp đồng mình phụ trách")
    public ApiSuccessResponse<List<HopDongThueResponseDTO>> getMyHopDong() {
        return ApiSuccessResponse.<List<HopDongThueResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng của tôi thành công")
                .data(hopDongThueService.getMyHopDong())
                .build();
    }
}
