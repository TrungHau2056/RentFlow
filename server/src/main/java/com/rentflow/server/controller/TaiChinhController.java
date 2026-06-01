package com.rentflow.server.controller;

import com.rentflow.server.dto.request.GhiNhanThuRequestDTO;
import com.rentflow.server.dto.request.YeuCauHoanTraRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.dto.response.taichinh.HoaHongResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongKyGuiEligibleResponseDTO;
import com.rentflow.server.dto.response.taichinh.HopDongThueEligibleResponseDTO;
import com.rentflow.server.service.GiaoDichTaiChinhService;
import com.rentflow.server.service.HoaHongService;
import com.rentflow.server.service.HopDongKyGuiTaiChinhService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@PreAuthorize("hasAnyRole('KE_TOAN','NHAN_VIEN_KE_TOAN','QUAN_TRI_VIEN','ADMIN')")
@Tag(name = "12. Tài chính", description = "Quản lý giao dịch tài chính, hoa hồng")
public class TaiChinhController {

    private final GiaoDichTaiChinhService giaoDichService;
    private final HoaHongService hoaHongService;
    private final HopDongKyGuiTaiChinhService hopDongKyGuiTaiChinhService;

    @PostMapping("/ghi-nhan-thu")
    @Operation(summary = "Ghi nhận thu tiền đảm bảo", description = "Ghi nhận thu tiền đảm bảo từ khách hàng")
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
    @Operation(summary = "Danh sách giao dịch", description = "Lấy danh sách giao dịch tài chính (có thể lọc theo loại)")
    public ApiSuccessResponse<List<GiaoDichTaiChinhResponseDTO>> layDanhSachGiaoDich(
            @RequestParam(required = false) String loaiGiaoDich) {
        return ApiSuccessResponse.<List<GiaoDichTaiChinhResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách giao dịch thành công")
                .data(giaoDichService.layDanhSachGiaoDich(loaiGiaoDich))
                .build();
    }

    @GetMapping("/giao-dich/{id}")
    @Operation(summary = "Chi tiết giao dịch", description = "Lấy chi tiết giao dịch tài chính theo ID")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> layChiTietGiaoDich(@PathVariable Long id) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết giao dịch thành công")
                .data(giaoDichService.layChiTietGiaoDich(id))
                .build();
    }

    @PutMapping("/giao-dich/{id}/xac-nhan")
    @Operation(summary = "Xác nhận giao dịch", description = "Duyệt giao dịch tài chính đang chờ xử lý")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> xacNhanGiaoDich(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Xác nhận giao dịch thành công")
                .data(giaoDichService.xacNhanGiaoDich(id, jwt.getSubject()))
                .build();
    }

    @GetMapping("/giao-dich/export")
    @Operation(summary = "Xuất CSV giao dịch", description = "Xuất danh sách giao dịch tài chính dạng CSV UTF-8")
    public ResponseEntity<String> xuatGiaoDichCsv() {
        return csvResponse("giao-dich-tai-chinh.csv", giaoDichService.xuatCsvGiaoDich());
    }

    @PostMapping("/tinh-hoa-hong/{hopDongThueId}")
    @Operation(summary = "Tính hoa hồng", description = "Tính và tạo hoa hồng cho hợp đồng thuê")
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
    @Operation(summary = "Danh sách hoa hồng", description = "Lấy danh sách hoa hồng")
    public ApiSuccessResponse<List<HoaHongResponseDTO>> layDanhSachHoaHong() {
        return ApiSuccessResponse.<List<HoaHongResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hoa hồng thành công")
                .data(hoaHongService.layDanhSachHoaHong())
                .build();
    }

    @GetMapping("/hoa-hong/export")
    @Operation(summary = "Xuất CSV hoa hồng", description = "Xuất danh sách hoa hồng dạng CSV UTF-8")
    public ResponseEntity<String> xuatHoaHongCsv() {
        return csvResponse("hoa-hong.csv", hoaHongService.xuatCsvHoaHong());
    }

    @GetMapping("/hoa-hong/{id}")
    @Operation(summary = "Chi tiết hoa hồng", description = "Lấy chi tiết hoa hồng theo ID")
    public ApiSuccessResponse<HoaHongResponseDTO> layChiTietHoaHong(@PathVariable Long id) {
        return ApiSuccessResponse.<HoaHongResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy chi tiết hoa hồng thành công")
                .data(hoaHongService.layChiTietHoaHong(id))
                .build();
    }

    @PutMapping("/hoa-hong/{id}/thanh-toan")
    @Operation(summary = "Đánh dấu đã thanh toán", description = "Đánh dấu hoa hồng đã được thanh toán")
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
    @Operation(summary = "Hợp đồng đủ điều kiện hoàn trả", description = "Quét hợp đồng ký gửi đủ điều kiện hoàn trả tiền đảm bảo")
    public ApiSuccessResponse<List<HopDongKyGuiEligibleResponseDTO>> quetHopDongDuDieuKien() {
        List<HopDongKyGuiEligibleResponseDTO> result =
                hopDongKyGuiTaiChinhService.quetHopDongDuDieuKienHoanTra();
        return ApiSuccessResponse.<List<HopDongKyGuiEligibleResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Tìm thấy " + result.size() + " hợp đồng đủ điều kiện hoàn trả")
                .data(result)
                .build();
    }

    @GetMapping("/hop-dong-ky-gui/cho-ghi-nhan-thu")
    @Operation(summary = "Hợp đồng chờ ghi nhận thu", description = "Danh sách hợp đồng ký gửi đang hoạt động chưa ghi nhận thu tiền đảm bảo")
    public ApiSuccessResponse<List<HopDongKyGuiEligibleResponseDTO>> layHopDongChoGhiNhanThu() {
        List<HopDongKyGuiEligibleResponseDTO> result = hopDongKyGuiTaiChinhService.layHopDongChoGhiNhanThu();
        return ApiSuccessResponse.<List<HopDongKyGuiEligibleResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng chờ ghi nhận thu thành công")
                .data(result)
                .build();
    }

    @GetMapping("/hop-dong-thue/cho-tinh-hoa-hong")
    @Operation(summary = "Hợp đồng thuê chờ tính hoa hồng", description = "Danh sách hợp đồng thuê đã ký chưa có hoa hồng")
    public ApiSuccessResponse<List<HopDongThueEligibleResponseDTO>> layHopDongThueChoTinhHoaHong() {
        List<HopDongThueEligibleResponseDTO> result = hoaHongService.layHopDongThueChoTinhHoaHong();
        return ApiSuccessResponse.<List<HopDongThueEligibleResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách hợp đồng thuê chờ tính hoa hồng thành công")
                .data(result)
                .build();
    }

    @PostMapping("/hoan-tra")
    @Operation(summary = "Hoàn trả tiền đảm bảo", description = "Xuất lệnh hoàn trả tiền đảm bảo cho chủ nhà")
    public ApiSuccessResponse<GiaoDichTaiChinhResponseDTO> hoanTra(
            @RequestBody @Valid YeuCauHoanTraRequestDTO dto,
            @AuthenticationPrincipal Jwt jwt) {
        return ApiSuccessResponse.<GiaoDichTaiChinhResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Xuất lệnh hoàn trả tiền đảm bảo thành công")
                .data(hopDongKyGuiTaiChinhService.xuatLenhHoanTra(dto, jwt.getSubject()))
                .build();
    }

    private ResponseEntity<String> csvResponse(String filename, String content) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv", java.nio.charset.StandardCharsets.UTF_8))
                .body("\uFEFF" + content);
    }
}
