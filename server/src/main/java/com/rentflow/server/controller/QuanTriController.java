package com.rentflow.server.controller;

import com.rentflow.server.dto.request.DoiTrangThaiTaiKhoanRequestDTO;
import com.rentflow.server.dto.request.DoiVaiTroRequestDTO;
import com.rentflow.server.dto.request.TaoNhanVienRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.quantri.TaiKhoanNhanVienResponseDTO;
import com.rentflow.server.service.QuanTriTaiKhoanService;
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
public class QuanTriController {

    private final QuanTriTaiKhoanService service;

    @GetMapping
    public ApiSuccessResponse<List<TaiKhoanNhanVienResponseDTO>> layDanhSach() {
        return ApiSuccessResponse.<List<TaiKhoanNhanVienResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách tài khoản thành công")
                .data(service.layDanhSach())
                .build();
    }

    @GetMapping("/{id}")
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> layChiTiet(@PathVariable Long id) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết tài khoản thành công")
                .data(service.layChiTiet(id))
                .build();
    }

    @PostMapping
    public ApiSuccessResponse<TaiKhoanNhanVienResponseDTO> taoTaiKhoan(
            @RequestBody @Valid TaoNhanVienRequestDTO dto) {
        return ApiSuccessResponse.<TaiKhoanNhanVienResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Tạo tài khoản nhân viên thành công")
                .data(service.taoTaiKhoan(dto))
                .build();
    }

    @PutMapping("/{id}/trang-thai")
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
    public ApiSuccessResponse<Void> xoaTaiKhoan(@PathVariable Long id) {
        service.xoaTaiKhoan(id);
        return ApiSuccessResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xoá tài khoản thành công")
                .build();
    }
}
