package com.rentflow.server.controller;

import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.baocao.*;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.service.BaoCaoService;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    private final SecurityUtils securityUtils;
    private final NhanVienRepository nhanVienRepository;

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

    @GetMapping("/hop-dong")
    @Operation(summary = "Báo cáo hợp đồng", description = "Thống kê hợp đồng ký gửi và hợp đồng thuê")
    public ApiSuccessResponse<BaoCaoHopDongResponseDTO> baoCaoHopDong(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        int t = resolveThang(thang);
        int n = resolveNam(nam);
        return ApiSuccessResponse.<BaoCaoHopDongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Báo cáo hợp đồng thành công")
                .data(service.baoCaoHopDong(t, n))
                .build();
    }

    @PostMapping("/luu")
    @Operation(summary = "Lưu báo cáo", description = "Lưu báo cáo vào lịch sử D13")
    public ApiSuccessResponse<BaoCaoLichSuDTO> luuBaoCao(@RequestBody BaoCaoRequestDTO request) {
        NhanVien admin = getCurrentNhanVien();
        BaoCaoLichSuDTO result = service.luuBaoCao(admin, request.getLoaiBaoCao(),
                request.getNoiDung(), request.getThang(), request.getNam());
        return ApiSuccessResponse.<BaoCaoLichSuDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Lưu báo cáo thành công")
                .data(result)
                .build();
    }

    @GetMapping("/lich-su")
    @Operation(summary = "Lịch sử báo cáo", description = "Danh sách báo cáo đã lưu")
    public ApiSuccessResponse<List<BaoCaoLichSuDTO>> lichSuBaoCao() {
        NhanVien admin = getCurrentNhanVien();
        return ApiSuccessResponse.<List<BaoCaoLichSuDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lịch sử báo cáo thành công")
                .data(service.lichSuBaoCao(admin))
                .build();
    }

    @GetMapping("/chi-tiet/{id}")
    @Operation(summary = "Chi tiết báo cáo", description = "Xem chi tiết một báo cáo đã lưu")
    public ApiSuccessResponse<BaoCaoLichSuDTO> chiTietBaoCao(@PathVariable Long id) {
        NhanVien admin = getCurrentNhanVien();
        return ApiSuccessResponse.<BaoCaoLichSuDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Chi tiết báo cáo thành công")
                .data(service.chiTietBaoCao(id, admin))
                .build();
    }

    private int resolveThang(Integer thang) {
        return thang != null ? thang : LocalDate.now().getMonthValue();
    }

    private int resolveNam(Integer nam) {
        return nam != null ? nam : LocalDate.now().getYear();
    }

    private NhanVien getCurrentNhanVien() {
        TaiKhoan taiKhoan = securityUtils.getCurrentUser();
        return nhanVienRepository.findByTaiKhoanId(taiKhoan.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
    }
}
