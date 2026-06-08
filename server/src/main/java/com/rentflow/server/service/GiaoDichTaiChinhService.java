package com.rentflow.server.service;

import com.rentflow.server.config.TaiChinhConfig;
import com.rentflow.server.dto.request.GhiNhanThuRequestDTO;
import com.rentflow.server.dto.response.taichinh.GiaoDichTaiChinhResponseDTO;
import com.rentflow.server.entity.GiaoDichTaiChinh;
import com.rentflow.server.entity.HopDongKyGui;
import com.rentflow.server.entity.HopDongThue;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.GiaoDichTaiChinhRepository;
import com.rentflow.server.repository.HopDongKyGuiRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.LoaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiGiaoDich;
import com.rentflow.server.util.enums.TrangThaiHopDongKyGui;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GiaoDichTaiChinhService {

    private final GiaoDichTaiChinhRepository giaoDichRepo;
    private final HopDongKyGuiRepository hopDongKyGuiRepo;
    private final NhanVienRepository nhanVienRepo;
    private final TaiChinhConfig config;

    @Transactional
    public GiaoDichTaiChinhResponseDTO ghiNhanTienDamBao(GhiNhanThuRequestDTO dto, String username) {
        NhanVien ketoan = nhanVienRepo.findByTaiKhoanUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));

        HopDongKyGui hopDong = hopDongKyGuiRepo.findById(dto.getHopDongKyGuiId())
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_KY_GUI_NOT_FOUND));

        if (!TrangThaiHopDongKyGui.DANG_HOAT_DONG.name().equals(hopDong.getTrangThai())) {
            throw new AppException(ErrorCode.HOP_DONG_KHONG_HOP_LE);
        }

        if (giaoDichRepo.existsByHopDongKyGuiIdAndLoaiGiaoDich(
                hopDong.getId(), LoaiGiaoDich.TIEN_DAM_BAO.name())) {
            throw new AppException(ErrorCode.TIEN_DAM_BAO_DA_THU);
        }

        BigDecimal soTienDamBao = resolveTienDamBao(hopDong);

        GiaoDichTaiChinh giaoDich = GiaoDichTaiChinh.builder()
                .nhanVienKeToan(ketoan)
                .hopDongKyGui(hopDong)
                .loaiGiaoDich(LoaiGiaoDich.TIEN_DAM_BAO.name())
                .soTien(soTienDamBao)
                .ngayGiaoDich(LocalDateTime.now())
                .ghiChu("Ghi nhận thu tiền đảm bảo theo hợp đồng ký gửi")
                .trangThai(TrangThaiGiaoDich.CHO_XU_LY.name())
                .build();

        giaoDich = giaoDichRepo.save(giaoDich);
        return toDTO(giaoDich);
    }

    public List<GiaoDichTaiChinhResponseDTO> layDanhSachGiaoDich(String loaiGiaoDich) {
        List<GiaoDichTaiChinh> list = (loaiGiaoDich != null && !loaiGiaoDich.isBlank())
                ? giaoDichRepo.findByLoaiGiaoDich(loaiGiaoDich)
                : giaoDichRepo.findAll();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public GiaoDichTaiChinhResponseDTO xacNhanGiaoDich(Long id, String username) {
        NhanVien nguoiXacNhan = nhanVienRepo.findByTaiKhoanUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        GiaoDichTaiChinh giaoDich = giaoDichRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GIAO_DICH_NOT_FOUND));
        if (!TrangThaiGiaoDich.CHO_XU_LY.name().equals(giaoDich.getTrangThai())) {
            throw new AppException(ErrorCode.GIAO_DICH_KHONG_CHO_XU_LY);
        }
        giaoDich.setTrangThai(TrangThaiGiaoDich.HOAN_THANH.name());
        giaoDich.setNgayXacNhan(LocalDateTime.now());
        giaoDich.setNguoiXacNhan(nguoiXacNhan);
        return toDTO(giaoDichRepo.save(giaoDich));
    }

    public String xuatCsvGiaoDich() {
        StringBuilder csv = new StringBuilder("ID,Loai giao dich,So tien,Trang thai,Ngay giao dich,Hop dong ky gui,Hop dong thue,Bat dong san,Chu nha,Khach thue,Nguoi xac nhan\n");
        giaoDichRepo.findAll().stream().map(this::toDTO).forEach(g -> csv.append(g.getId()).append(',')
                .append(csv(g.getLoaiGiaoDich())).append(',')
                .append(g.getSoTien() != null ? g.getSoTien() : BigDecimal.ZERO).append(',')
                .append(csv(g.getTrangThai())).append(',')
                .append(csv(g.getNgayGiaoDich() != null ? g.getNgayGiaoDich().toString() : "")).append(',')
                .append(g.getHopDongKyGuiId() != null ? g.getHopDongKyGuiId() : "").append(',')
                .append(g.getHopDongThueId() != null ? g.getHopDongThueId() : "").append(',')
                .append(csv(g.getBatDongSanDiaChi())).append(',')
                .append(csv(g.getChuNhaHoTen())).append(',')
                .append(csv(g.getKhachHangHoTen())).append(',')
                .append(csv(g.getNguoiXacNhanHoTen())).append('\n'));
        return csv.toString();
    }

    public GiaoDichTaiChinhResponseDTO layChiTietGiaoDich(Long id) {
        GiaoDichTaiChinh giaoDich = giaoDichRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GIAO_DICH_NOT_FOUND));
        return toDTO(giaoDich);
    }

    public GiaoDichTaiChinhResponseDTO toDTO(GiaoDichTaiChinh g) {
        HopDongKyGui hopDongKyGui = g.getHopDongKyGui();
        HopDongThue hopDongThue = g.getHopDongThue();
        Long hopDongKyGuiId = hopDongKyGui != null ? hopDongKyGui.getId() : null;
        BigDecimal soTienDamBaoHopDong = hopDongKyGui != null ? resolveTienDamBao(hopDongKyGui) : null;
        BigDecimal daKhauTru = hopDongKyGuiId != null ? nullSafe(sumGiaoDichHoanThanh(hopDongKyGuiId, LoaiGiaoDich.KHAU_TRU_DAM_BAO)) : BigDecimal.ZERO;
        BigDecimal daHoanTra = hopDongKyGuiId != null ? nullSafe(sumGiaoDichHoanThanh(hopDongKyGuiId, LoaiGiaoDich.HOAN_TRA_DAM_BAO)) : BigDecimal.ZERO;
        BigDecimal conLai = soTienDamBaoHopDong != null ? soTienDamBaoHopDong.subtract(daKhauTru).subtract(daHoanTra) : null;
        return GiaoDichTaiChinhResponseDTO.builder()
                .id(g.getId())
                .loaiGiaoDich(g.getLoaiGiaoDich())
                .soTien(g.getSoTien())
                .ngayGiaoDich(g.getNgayGiaoDich())
                .trangThai(g.getTrangThai())
                .ghiChu(g.getGhiChu())
                .ngayXacNhan(g.getNgayXacNhan())
                .nguoiXacNhanId(g.getNguoiXacNhan() != null ? g.getNguoiXacNhan().getId() : null)
                .nguoiXacNhanHoTen(g.getNguoiXacNhan() != null ? g.getNguoiXacNhan().getHoTen() : null)
                .hopDongKyGuiId(hopDongKyGuiId)
                .hopDongThueId(hopDongThue != null ? hopDongThue.getId() : null)
                .nhanVienKeToanId(g.getNhanVienKeToan() != null ? g.getNhanVienKeToan().getId() : null)
                .nhanVienKeToanHoTen(g.getNhanVienKeToan() != null ? g.getNhanVienKeToan().getHoTen() : null)
                .batDongSanId(resolveBatDongSanId(hopDongKyGui, hopDongThue))
                .batDongSanDiaChi(resolveBatDongSanDiaChi(hopDongKyGui, hopDongThue))
                .chuNhaId(hopDongKyGui != null && hopDongKyGui.getChuNha() != null ? hopDongKyGui.getChuNha().getId() : null)
                .chuNhaHoTen(hopDongKyGui != null && hopDongKyGui.getChuNha() != null ? hopDongKyGui.getChuNha().getHoTen() : null)
                .khachHangHoTen(hopDongThue != null && hopDongThue.getKhachHang() != null ? hopDongThue.getKhachHang().getHoTen() : null)
                .moiGioiHoTen(hopDongThue != null && hopDongThue.getNhanVienMoiGioi() != null ? hopDongThue.getNhanVienMoiGioi().getHoTen() : null)
                .soTienDamBaoHopDong(soTienDamBaoHopDong)
                .soTienDaKhauTru(daKhauTru)
                .soTienConLai(conLai)
                .build();
    }

    public BigDecimal resolveTienDamBao(HopDongKyGui hopDong) {
        BigDecimal fallback = config.getTienDamBao() != null ? config.getTienDamBao() : BigDecimal.ZERO;
        return hopDong.getTienDamBao() != null && hopDong.getTienDamBao().compareTo(BigDecimal.ZERO) > 0
                ? hopDong.getTienDamBao()
                : fallback;
    }

    public BigDecimal sumGiaoDichHoanThanh(Long hopDongKyGuiId, LoaiGiaoDich loaiGiaoDich) {
        return giaoDichRepo.sumByHopDongKyGuiIdAndLoaiGiaoDichAndTrangThai(
                hopDongKyGuiId, loaiGiaoDich.name(), TrangThaiGiaoDich.HOAN_THANH.name());
    }

    private Long resolveBatDongSanId(HopDongKyGui hopDongKyGui, HopDongThue hopDongThue) {
        if (hopDongKyGui != null && hopDongKyGui.getBatDongSan() != null) return hopDongKyGui.getBatDongSan().getId();
        return hopDongThue != null && hopDongThue.getBatDongSan() != null ? hopDongThue.getBatDongSan().getId() : null;
    }

    private String resolveBatDongSanDiaChi(HopDongKyGui hopDongKyGui, HopDongThue hopDongThue) {
        if (hopDongKyGui != null && hopDongKyGui.getBatDongSan() != null) return hopDongKyGui.getBatDongSan().getDiaChi();
        return hopDongThue != null && hopDongThue.getBatDongSan() != null ? hopDongThue.getBatDongSan().getDiaChi() : null;
    }

    private String csv(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
