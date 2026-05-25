package com.rentflow.server.controller;

import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.baocao.DoanhThuHoaHongResponseDTO;
import com.rentflow.server.dto.response.baocao.HieuSuatMoiGioiResponseDTO;
import com.rentflow.server.dto.response.baocao.ThongKeBatDongSanResponseDTO;
import com.rentflow.server.service.BaoCaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bao-cao")
@Validated
@RequiredArgsConstructor
@PreAuthorize("hasRole('QUAN_TRI_VIEN')")
@Tag(name = "13. Báo cáo / Thống kê", description = "Báo cáo doanh thu, hiệu suất (chỉ QUAN_TRI_VIEN)")
public class BaoCaoController {

    private final BaoCaoService service;

    @GetMapping("/bat-dong-san/thong-ke")
    @Operation(summary = "Thống kê bất động sản", description = "Thống kê số lượng bất động sản theo tháng/năm")
    public ApiSuccessResponse<ThongKeBatDongSanResponseDTO> thongKeBatDongSan(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        int t = resolveThang(thang);
        int n = resolveNam(nam);
        return ApiSuccessResponse.<ThongKeBatDongSanResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Thống kê bất động sản thành công")
                .data(service.thongKeBatDongSan(t, n))
                .build();
    }

    @GetMapping("/hoa-hong/doanh-thu")
    @Operation(summary = "Doanh thu hoa hồng", description = "Báo cáo doanh thu hoa hồng theo tháng/năm")
    public ApiSuccessResponse<DoanhThuHoaHongResponseDTO> doanhThuHoaHong(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        int t = resolveThang(thang);
        int n = resolveNam(nam);
        return ApiSuccessResponse.<DoanhThuHoaHongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Báo cáo doanh thu hoa hồng thành công")
                .data(service.doanhThuHoaHong(t, n))
                .build();
    }

    @GetMapping("/moi-gioi/hieu-suat")
    @Operation(summary = "Hiệu suất môi giới", description = "Báo cáo hiệu suất của nhân viên môi giới theo tháng/năm")
    public ApiSuccessResponse<List<HieuSuatMoiGioiResponseDTO>> hieuSuatMoiGioi(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        int t = resolveThang(thang);
        int n = resolveNam(nam);
        return ApiSuccessResponse.<List<HieuSuatMoiGioiResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Báo cáo hiệu suất môi giới thành công")
                .data(service.hieuSuatMoiGioi(t, n))
                .build();
    }

    private int resolveThang(Integer thang) {
        return thang != null ? thang : LocalDate.now().getMonthValue();
    }

    private int resolveNam(Integer nam) {
        return nam != null ? nam : LocalDate.now().getYear();
    }
}
