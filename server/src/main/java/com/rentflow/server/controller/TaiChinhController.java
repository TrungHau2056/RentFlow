package com.rentflow.server.controller;

import com.rentflow.server.dto.request.GhiNhanThuRequestDTO;
import com.rentflow.server.dto.request.YeuCauHoanTraRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.dto.response.taichinh.HoaHongResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongKyGuiEligibleResponseDTO;
import com.rentflow.server.service.GiaoDichTaiChinhService;
import com.rentflow.server.service.HoaHongService;
import com.rentflow.server.service.HopDongKyGuiTaiChinhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tai-chinh")
@Validated
@RequiredArgsConstructor
@PreAuthorize("hasRole('KE_TOAN')")
public class TaiChinhController {

    private final GiaoDichTaiChinhService giaoDichService;
    private final HoaHongService hoaHongService;
    private final HopDongKyGuiTaiChinhService hopDongKyGuiTaiChinhService;

    @PostMapping("/ghi-nhan-thu")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> ghiNhanThu(
            @RequestBody @Valid GhiNhanThuRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Ghi nhận thu tiền đảm bảo thành công")
                .data(giaoDichService.ghiNhanTienDamBao(dto, jwt.getSubject()))
                .build();
    }

    @GetMapping("/giao-dich")
    public ApiSuccessResponse<List<GiaoDichTaiChinhResponseDTO>> layDanhSachGiaoDich(
            @RequestParam(required = false) String loaiGiaoDich) {
        return ApiSuccessResponse.<List<GiaoDichTaiChinhResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách giao dịch thành công")
                .data(giaoDichService.layDanhSachGiaoDich(loaiGiaoDich))
                .build();
    }

    @GetMapping("/giao-dich/{id}")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> layChiTietGiaoDich(@PathVariable Long id) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết giao dịch thành công")
                .data(giaoDichService.layChiTietGiaoDich(id))
                .build();
    }

    @PostMapping("/tinh-hoa-hong/{hopDongThueId}")
    public ApiSuccessResponse<HoaHongResponseDTO> tinhHoaHong(
            @PathVariable Long hopDongThueId,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<HoaHongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Tính hoa hồng thành công")
                .data(hoaHongService.tinhVaTaoHoaHong(hopDongThueId, jwt.getSubject()))
                .build();
    }

    @GetMapping("/hoa-hong")
    public ApiSuccessResponse<List<HoaHongResponseDTO>> layDanhSachHoaHong() {
        return ApiSuccessResponse.<List<HoaHongResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hoa hồng thành công")
                .data(hoaHongService.layDanhSachHoaHong())
                .build();
    }

    @GetMapping("/hoa-hong/{id}")
    public ApiSuccessResponse<HoaHongResponseDTO> layChiTietHoaHong(@PathVariable Long id) {
        return ApiSuccessResponse.<HoaHongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết hoa hồng thành công")
                .data(hoaHongService.layChiTietHoaHong(id))
                .build();
    }

    @PutMapping("/hoa-hong/{id}/thanh-toan")
    public ApiSuccessResponse<HoaHongResponseDTO> danhDauThanhToan(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<HoaHongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái thanh toán hoa hồng thành công")
                .data(hoaHongService.danhDauDaThanhToan(id, jwt.getSubject()))
                .build();
    }

    @GetMapping("/hop-dong-ky-gui/du-dieu-kien-hoan-tra")
    public ApiSuccessResponse<List<HopDongKyGuiEligibleResponseDTO>> quetHopDongDuDieuKien() {
        List<HopDongKyGuiEligibleResponseDTO> result =
                hopDongKyGuiTaiChinhService.quetHopDongDuDieuKienHoanTra();
        return ApiSuccessResponse.<List<HopDongKyGuiEligibleResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Tìm thấy " + result.size() + " hợp đồng đủ điều kiện hoàn trả")
                .data(result)
                .build();
    }

    @PostMapping("/hoan-tra")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> hoanTra(
            @RequestBody @Valid YeuCauHoanTraRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Xuất lệnh hoàn trả tiền đảm bảo thành công")
                .data(hopDongKyGuiTaiChinhService.xuatLenhHoanTra(dto, jwt.getSubject()))
                .build();
    }
}
