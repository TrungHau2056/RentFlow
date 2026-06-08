package com.rentflow.server.controller;

import com.rentflow.server.dto.request.BatDongSanChiTietRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.BatDongSanDetailDTO;
import com.rentflow.server.dto.response.BatDongSanSummaryDTO;
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

@RestController
@RequestMapping("/api/bat-dong-san-cong-khai")
@Validated
@RequiredArgsConstructor
@Tag(name = "03. Bất động sản (Công khai)", description = "Tra cứu bất động sản công khai cho khách hàng")
public class BatDongSanPublicController {
    private final BatDongSanService batDongSanService;

    @GetMapping
    @Operation(summary = "Danh sách công khai", description = "Lấy danh sách bất động sản đang cho thuê (công khai)")
    public ApiSuccessResponse<List<BatDongSanSummaryDTO>> getAll() {
        return ApiSuccessResponse.<List<BatDongSanSummaryDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách bất động sản thành công")
                .data(batDongSanService.getAllPublic())
                .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết công khai", description = "Lấy thông tin bất động sản công khai theo ID")
    public ApiSuccessResponse<Object> getById(@PathVariable Long id) {
        return ApiSuccessResponse.<Object>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin bất động sản thành công")
                .data(batDongSanService.getByIdPublic(id))
                .build();
    }

    @GetMapping("/{id}/detail")
    @PreAuthorize("hasAnyRole('KHACH_HANG', 'CHU_NHA', 'NHAN_VIEN_DAI_LY', 'BO_PHAN_PHAP_LUAT')")
    @Operation(summary = "Chi tiết đầy đủ", description = "Lấy chi tiết đầy đủ bất động sản (yêu cầu đăng nhập)")
    public ApiSuccessResponse<BatDongSanDetailDTO> getDetail(@PathVariable Long id) {
        return ApiSuccessResponse.<BatDongSanDetailDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin chi tiết bất động sản thành công")
                .data(batDongSanService.getDetail(id))
                .build();
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm", description = "Tìm kiếm bất động sản theo loại nhà, giá, diện tích, hướng")
    public ApiSuccessResponse<List<BatDongSanSummaryDTO>> search(
            @RequestParam(required = false) String loaiNha,
            @RequestParam(required = false) Double giaMin,
            @RequestParam(required = false) Double giaMax,
            @RequestParam(required = false) Double dienTichMin,
            @RequestParam(required = false) Double dienTichMax,
            @RequestParam(required = false) String huong) {
        return ApiSuccessResponse.<List<BatDongSanSummaryDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Tìm kiếm bất động sản thành công")
                .data(batDongSanService.search(loaiNha, giaMin, giaMax, dienTichMin, dienTichMax, huong))
                .build();
    }

    @PutMapping("/{id}/chi-tiet")
    @PreAuthorize("hasAnyRole('CHU_NHA', 'NHAN_VIEN_DAI_LY')")
    @Operation(summary = "Cập nhật chi tiết", description = "Cập nhật thông số chi tiết bất động sản")
    public ApiSuccessResponse<BatDongSanDetailDTO> updateChiTiet(
            @PathVariable Long id,
            @RequestBody @Valid BatDongSanChiTietRequestDTO dto) {
        return ApiSuccessResponse.<BatDongSanDetailDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông số chi tiết bất động sản thành công")
                .data(batDongSanService.updateChiTiet(id, dto))
                .build();
    }
}
