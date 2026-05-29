package com.rentflow.server.controller;

import com.rentflow.server.dto.request.DatLichXemNhaRequestDTO;
import com.rentflow.server.dto.request.LichHenXemNhaRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.LichHenXemNhaResponseDTO;
import com.rentflow.server.service.LichHenXemNhaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lich-hen-xem-nha")
@Validated
@RequiredArgsConstructor
@Tag(name = "08. Lịch hẹn xem nhà", description = "Quản lý lịch hẹn xem nhà")
public class LichHenXemNhaController {
    private final LichHenXemNhaService lichHenXemNhaService;

    @PostMapping
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Tạo lịch hẹn xem nhà", description = "Tạo lịch hẹn xem nhà mới")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> create(@RequestBody @Valid LichHenXemNhaRequestDTO dto) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo lịch hẹn xem nhà thành công")
                .data(lichHenXemNhaService.create(dto))
                .build();
    }

    @PostMapping("/khach-hang")
    @PreAuthorize("hasRole('KHACH_HANG')")
    @Operation(summary = "Khách hàng đặt lịch xem nhà", description = "Cho phép khách hàng tự đặt lịch xem nhà")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> createByCustomer(@RequestBody @Valid DatLichXemNhaRequestDTO dto) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Đặt lịch xem nhà thành công")
                .data(lichHenXemNhaService.createByCustomer(dto))
                .build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('KHACH_HANG')")
    @Operation(summary = "Lịch hẹn của tôi", description = "Lấy danh sách lịch hẹn xem nhà của khách hàng hiện tại")
    public ApiSuccessResponse<List<LichHenXemNhaResponseDTO>> getMySchedules() {
        return ApiSuccessResponse.<List<LichHenXemNhaResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách lịch hẹn thành công")
                .data(lichHenXemNhaService.getMySchedules())
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'KHACH_HANG')")
    @Operation(summary = "Danh sách lịch hẹn", description = "Lấy danh sách lịch hẹn xem nhà (có thể lọc theo nhiều tiêu chí)")
    public ApiSuccessResponse<List<LichHenXemNhaResponseDTO>> getAll(
            @RequestParam(required = false) Long nhanVienId,
            @RequestParam(required = false) Long khachHangId,
            @RequestParam(required = false) Long batDongSanId,
            @RequestParam(required = false) String trangThai) {
        return ApiSuccessResponse.<List<LichHenXemNhaResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách lịch hẹn thành công")
                .data(lichHenXemNhaService.getAll(nhanVienId, khachHangId, batDongSanId, trangThai))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'KHACH_HANG')")
    @Operation(summary = "Chi tiết lịch hẹn", description = "Lấy chi tiết lịch hẹn xem nhà theo ID")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết lịch hẹn thành công")
                .data(lichHenXemNhaService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật lịch hẹn", description = "Cập nhật thông tin lịch hẹn xem nhà")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid LichHenXemNhaRequestDTO dto) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật lịch hẹn thành công")
                .data(lichHenXemNhaService.update(id, dto))
                .build();
    }

    @PatchMapping("/{id}/trang-thai")
    @PreAuthorize("hasAnyRole('NHAN_VIEN_DAI_LY', 'KHACH_HANG')")
    @Operation(summary = "Cập nhật trạng thái lịch hẹn", description = "Cập nhật trạng thái lịch hẹn (đến hẹn, hủy, hoàn thành...)")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> updateTrangThai(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái lịch hẹn thành công")
                .data(lichHenXemNhaService.updateTrangThai(id, body.get("trangThai")))
                .build();
    }

    @PatchMapping("/{id}/reschedule")
    @PreAuthorize("hasRole('KHACH_HANG')")
    @Operation(summary = "Khách hàng đổi lịch hẹn", description = "Cho phép khách hàng đổi lịch hẹn xem nhà")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> reschedule(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Đổi lịch hẹn thành công")
                .data(lichHenXemNhaService.reschedule(id, LocalDateTime.parse(body.get("thoiGian"))))
                .build();
    }

    @PutMapping("/{id}/phan-hoi")
    @PreAuthorize("hasRole('NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Ghi nhận phản hồi", description = "Ghi nhận phản hồi sau khi xem nhà")
    public ApiSuccessResponse<LichHenXemNhaResponseDTO> updatePhanHoi(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ApiSuccessResponse.<LichHenXemNhaResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Ghi nhận phản hồi thành công")
                .data(lichHenXemNhaService.updatePhanHoi(id, body.get("phanHoi"), body.get("noiDungTraoDoi")))
                .build();
    }
}