package com.rentflow.server.controller;

import com.rentflow.server.dto.request.DoiTrangThaiTaiKhoanRequestDTO;
import com.rentflow.server.dto.request.DoiVaiTroRequestDTO;
import com.rentflow.server.dto.request.TaoNhanVienRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.quantri.TaiKhoanNhanVienResponseDTO;
import com.rentflow.server.service.QuanTriTaiKhoanService;
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
@RequestMapping("/api/quan-tri/tai-khoan")
@Validated
@RequiredArgsConstructor
@PreAuthorize("hasRole('QUAN_TRI_VIEN')")
@Tag(name = "11. Quản trị", description = "Quản lý tài khoản nhân viên (chỉ QUAN_TRI_VIEN)")
public class QuanTriController {

    private final QuanTriTaiKhoanService service;

    @GetMapping
    @Operation(summary = "Danh sách tài khoản", description = "Lấy danh sách tất cả tài khoản nhân viên")
    public ApiSuccessResponse<List<TaiKhoanNhanVienResponseDTO>> layDanhSach() {
        return ApiSuccessResponse.<List<TaiKhoanNhanVienResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách tài khoản thành công")
                .data(service.layDanhSach())
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết tài khoản", description = "Lấy chi tiết tài khoản nhân viên theo ID")
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> layChiTiet(@PathVariable Long id) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết tài khoản thành công")
                .data(service.layChiTiet(id))
                .build();
    }

    @PostMapping
    @Operation(summary = "Tạo tài khoản nhân viên", description = "Tạo tài khoản nhân viên mới")
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> taoTaiKhoan(
            @RequestBody @Valid TaoNhanVienRequestDTO dto) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Tạo tài khoản nhân viên thành công")
                .data(service.taoTaiKhoan(dto))
                .build();
    }

    @PutMapping("/{id}/trang-thai")
    @Operation(summary = "Đổi trạng thái tài khoản", description = "Khoá/Mở khoá tài khoản nhân viên")
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> doiTrangThai(
            @PathVariable Long id,
            @RequestBody @Valid DoiTrangThaiTaiKhoanRequestDTO dto) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái tài khoản thành công")
                .data(service.doiTrangThai(id, dto))
                .build();
    }

    @PutMapping("/{id}/vai-tro")
    @Operation(summary = "Đổi vai trò", description = "Thay đổi vai trò của tài khoản nhân viên")
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> doiVaiTro(
            @PathVariable Long id,
            @RequestBody @Valid DoiVaiTroRequestDTO dto) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Đổi vai trò tài khoản thành công")
                .data(service.doiVaiTro(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xoá tài khoản", description = "Xoá tài khoản nhân viên")
    public ApiSuccessResponse<Void> xoaTaiKhoan(@PathVariable Long id) {
        service.xoaTaiKhoan(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xoá tài khoản thành công")
                .build();
    }
}
