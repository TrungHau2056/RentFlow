package com.rentflow.server.service;

import com.rentflow.server.dto.request.HopDongThueRequestDTO;
import com.rentflow.server.dto.response.HopDongThueEligibilityResponseDTO;
import com.rentflow.server.dto.response.HopDongThueResponseDTO;
import com.rentflow.server.entity.BatDongSan;
import com.rentflow.server.entity.HopDongThue;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.LichHenXemNha;
import com.rentflow.server.entity.NhanVien;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.BatDongSanRepository;
import com.rentflow.server.repository.HopDongThueRepository;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.LichHenXemNhaRepository;
import com.rentflow.server.repository.NhanVienRepository;
import com.rentflow.server.util.SecurityUtils;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TrangThaiBatDongSan;
import com.rentflow.server.util.enums.TrangThaiHopDong;
import com.rentflow.server.util.enums.TrangThaiLichHen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HopDongThueService {
    private final HopDongThueRepository hopDongThueRepository;
    private final KhachHangRepository khachHangRepository;
    private final BatDongSanRepository batDongSanRepository;
    private final NhanVienRepository nhanVienRepository;
    private final LichHenXemNhaRepository lichHenXemNhaRepository;
    private final HoaHongService hoaHongService;
    private final SecurityUtils securityUtils;

    private static final List<String> ACTIVE_CONTRACT_STATUSES = List.of(
            TrangThaiHopDong.DA_PHE_DUYET.name(),
            TrangThaiHopDong.DA_KY.name()
    );

    private static final Set<TrangThaiHopDong> INITIAL_STATUSES = EnumSet.of(
            TrangThaiHopDong.NHAP,
            TrangThaiHopDong.CHO_PHE_DUYET
    );

    private static final Map<TrangThaiHopDong, Set<TrangThaiHopDong>> STATUS_TRANSITIONS = createStatusTransitions();

    @Transactional
    public HopDongThueResponseDTO create(HopDongThueRequestDTO dto) {
        KhachHang kh = khachHangRepository.findById(dto.getKhachHangId())
                .orElseThrow(() -> new AppException(ErrorCode.KHACH_HANG_NOT_FOUND));
        BatDongSan bds = batDongSanRepository.findById(dto.getBatDongSanId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        NhanVien nv = nhanVienRepository.findById(dto.getNhanVienMoiGioiId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        validateContractData(dto, bds);
        validateViewingSchedule(dto.getLichHenXemNhaId(), kh.getId(), bds.getId(), nv.getId());
        validatePropertyAvailableForCreate(bds.getId());

        HopDongThue entity = HopDongThue.builder()
                .khachHang(kh)
                .batDongSan(bds)
                .nhanVienMoiGioi(nv)
                .ngayKy(null)
                .ngayBatDau(dto.getNgayBatDau())
                .ngayKetThuc(dto.getNgayKetThuc())
                .tienThue(dto.getTienThue())
                .tienCoc(dto.getTienCoc())
                .trangThai(normalizeInitialStatus(dto.getTrangThai()))
                .build();
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    public List<HopDongThueResponseDTO> getAll(String trangThai, Long khachHangId) {
        List<HopDongThue> list;
        if (trangThai != null && khachHangId != null) {
            list = hopDongThueRepository.findByTrangThaiAndKhachHangId(trangThai, khachHangId);
        } else if (trangThai != null) {
            list = hopDongThueRepository.findByTrangThai(trangThai);
        } else if (khachHangId != null) {
            list = hopDongThueRepository.findByKhachHangId(khachHangId);
        } else {
            list = hopDongThueRepository.findAll();
        }
        return list.stream().map(this::toResponseDTO).toList();
    }

    public HopDongThueResponseDTO getById(Long id) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        return toResponseDTO(entity);
    }

    public HopDongThueResponseDTO update(Long id, HopDongThueRequestDTO dto) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        HopDongThueRequestDTO mergedDto = mergeForValidation(entity, dto);
        validateContractData(mergedDto, entity.getBatDongSan());
        if (dto.getNgayKy() != null) entity.setNgayKy(dto.getNgayKy());
        if (dto.getNgayBatDau() != null) entity.setNgayBatDau(dto.getNgayBatDau());
        if (dto.getNgayKetThuc() != null) entity.setNgayKetThuc(dto.getNgayKetThuc());
        if (dto.getTienThue() != null) entity.setTienThue(dto.getTienThue());
        if (dto.getTienCoc() != null) entity.setTienCoc(dto.getTienCoc());
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    @Transactional
    public HopDongThueResponseDTO kyHopDong(Long id) {
        return kyHopDong(id, null);
    }

    @Transactional
    public HopDongThueResponseDTO kyHopDong(Long id, LocalDate ngayKy) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));

        TrangThaiHopDong currentStatus = parseStatus(entity.getTrangThai());
        if (!TrangThaiHopDong.NHAP.equals(currentStatus) && !TrangThaiHopDong.DA_PHE_DUYET.equals(currentStatus)) {
            throw new AppException(ErrorCode.HOP_DONG_KHONG_HOP_LE);
        }

        BatDongSan bds = batDongSanRepository.findByIdForUpdate(entity.getBatDongSan().getId())
                .orElseThrow(() -> new AppException(ErrorCode.BAT_DONG_SAN_NOT_FOUND));
        if (!TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name().equals(bds.getTrangThai())) {
            throw new AppException(ErrorCode.INVALID_BAT_DONG_SAN);
        }
        validatePropertyAvailableForSigning(bds.getId(), entity.getId());

        entity.setTrangThai(TrangThaiHopDong.DA_KY.name());
        entity.setNgayKy(ngayKy != null ? ngayKy : LocalDate.now());
        hopDongThueRepository.save(entity);

        bds.setTrangThai(TrangThaiBatDongSan.DA_THUE.name());
        batDongSanRepository.save(bds);

        String username = securityUtils.getCurrentUser().getUsername();
        hoaHongService.tinhVaTaoHoaHong(id, username);

        return toResponseDTO(entity);
    }

    public HopDongThueResponseDTO updateTrangThai(Long id, String trangThai) {
        HopDongThue entity = hopDongThueRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.HOP_DONG_THUE_NOT_FOUND));
        if (trangThai == null || trangThai.isBlank()) {
            throw new AppException(ErrorCode.TRANG_THAI_KHONG_HOP_LE);
        }
        TrangThaiHopDong currentStatus = parseStatus(entity.getTrangThai());
        TrangThaiHopDong nextStatus = parseStatus(trangThai);
        validateGenericStatusTransition(currentStatus, nextStatus);
        entity.setTrangThai(nextStatus.name());
        return toResponseDTO(hopDongThueRepository.save(entity));
    }

    public List<HopDongThueResponseDTO> getMyHopDong() {
        TaiKhoan currentUser = securityUtils.getCurrentUser();
        String role = currentUser.getVaiTro() != null ? currentUser.getVaiTro().getTenVaiTro() : "";
        if ("KHACH_HANG".equals(role)) {
            return hopDongThueRepository.findByKhachHangTaiKhoanId(currentUser.getId()).stream()
                    .map(this::toResponseDTO)
                    .toList();
        }
        NhanVien nv = nhanVienRepository.findByTaiKhoanId(currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NHAN_VIEN_NOT_FOUND));
        return hopDongThueRepository.findByNhanVienMoiGioiId(nv.getId()).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public HopDongThueEligibilityResponseDTO checkEligibility(Long lichXemId, Long khachHangId, Long batDongSanId, Long nhanVienMoiGioiId) {
        List<String> failed = new ArrayList<>();
        LichHenXemNha lich = null;
        if (lichXemId != null) {
            lich = lichHenXemNhaRepository.findById(lichXemId)
                    .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
            khachHangId = lich.getKhachHang() != null ? lich.getKhachHang().getId() : khachHangId;
            batDongSanId = lich.getBatDongSan() != null ? lich.getBatDongSan().getId() : batDongSanId;
            nhanVienMoiGioiId = lich.getNhanVien() != null ? lich.getNhanVien().getId() : nhanVienMoiGioiId;
            if (!TrangThaiLichHen.DA_HOAN_THANH.name().equals(lich.getTrangThai())) {
                failed.add("Lịch xem nhà chưa hoàn thành");
            }
            if (!isAcceptedViewingResult(lich.getKetQua())) {
                failed.add("Lịch xem nhà chưa có kết quả khách đồng ý thuê");
            }
        }

        KhachHang khachHang = null;
        BatDongSan batDongSan = null;
        NhanVien nhanVien = null;
        if (khachHangId == null || khachHangRepository.findById(khachHangId).isEmpty()) {
            failed.add("Khách hàng không tồn tại");
        } else {
            khachHang = khachHangRepository.findById(khachHangId).get();
        }
        if (batDongSanId == null || batDongSanRepository.findById(batDongSanId).isEmpty()) {
            failed.add("Bất động sản không tồn tại");
        } else {
            batDongSan = batDongSanRepository.findById(batDongSanId).get();
            if (!TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name().equals(batDongSan.getTrangThai())) {
                failed.add("Bất động sản không đủ điều kiện cho thuê");
            }
            if (batDongSan.getGiaThue() == null && batDongSan.getGiaDeXuat() == null) {
                failed.add("Chưa có giá thuê đề xuất");
            }
            if (hopDongThueRepository.existsActiveByBatDongSan(batDongSan.getId(), ACTIVE_CONTRACT_STATUSES, LocalDate.now())) {
                failed.add("Bất động sản đã có hợp đồng thuê đang hoạt động");
            }
        }
        if (nhanVienMoiGioiId == null || nhanVienRepository.findById(nhanVienMoiGioiId).isEmpty()) {
            failed.add("Nhân viên môi giới không tồn tại");
        } else {
            nhanVien = nhanVienRepository.findById(nhanVienMoiGioiId).get();
        }

        return HopDongThueEligibilityResponseDTO.builder()
                .eligible(failed.isEmpty())
                .failedConditions(failed)
                .lichHenXemNhaId(lichXemId)
                .khachHangId(khachHang != null ? khachHang.getId() : khachHangId)
                .tenKhachHang(khachHang != null ? khachHang.getHoTen() : null)
                .batDongSanId(batDongSan != null ? batDongSan.getId() : batDongSanId)
                .diaChiBatDongSan(batDongSan != null ? batDongSan.getDiaChi() : null)
                .trangThaiBatDongSan(batDongSan != null ? batDongSan.getTrangThai() : null)
                .nhanVienMoiGioiId(nhanVien != null ? nhanVien.getId() : nhanVienMoiGioiId)
                .tenNhanVienMoiGioi(nhanVien != null ? nhanVien.getHoTen() : null)
                .giaThueDeXuat(batDongSan != null ? (batDongSan.getGiaThue() != null ? batDongSan.getGiaThue() : batDongSan.getGiaDeXuat()) : null)
                .build();
    }

    private HopDongThueResponseDTO toResponseDTO(HopDongThue entity) {
        return HopDongThueResponseDTO.builder()
                .id(entity.getId())
                .khachHangId(entity.getKhachHang().getId())
                .tenKhachHang(entity.getKhachHang().getHoTen())
                .sdtKhachHang(entity.getKhachHang().getSoDienThoai())
                .emailKhachHang(entity.getKhachHang().getEmail())
                .batDongSanId(entity.getBatDongSan().getId())
                .diaChiBatDongSan(entity.getBatDongSan().getDiaChi())
                .trangThaiBatDongSan(entity.getBatDongSan().getTrangThai())
                .loaiBatDongSan(entity.getBatDongSan().getLoaiNha())
                .dienTichBatDongSan(entity.getBatDongSan().getDienTich())
                .soPhongNgu(entity.getBatDongSan().getSoPhongNgu())
                .chuNhaId(entity.getBatDongSan().getChuNha() != null ? entity.getBatDongSan().getChuNha().getId() : null)
                .tenChuNha(entity.getBatDongSan().getChuNha() != null ? entity.getBatDongSan().getChuNha().getHoTen() : null)
                .sdtChuNha(entity.getBatDongSan().getChuNha() != null ? entity.getBatDongSan().getChuNha().getSoDienThoai() : null)
                .nhanVienMoiGioiId(entity.getNhanVienMoiGioi().getId())
                .tenNhanVienMoiGioi(entity.getNhanVienMoiGioi().getHoTen())
                .sdtNhanVienMoiGioi(entity.getNhanVienMoiGioi().getSoDienThoai())
                .ngayKy(entity.getNgayKy())
                .ngayBatDau(entity.getNgayBatDau())
                .ngayKetThuc(entity.getNgayKetThuc())
                .tienThue(entity.getTienThue())
                .tienCoc(entity.getTienCoc())
                .trangThai(entity.getTrangThai())
                .build();
    }

    private void validateContractData(HopDongThueRequestDTO dto, BatDongSan bds) {
        if (dto.getNgayBatDau() == null || dto.getNgayKetThuc() == null || !dto.getNgayKetThuc().isAfter(dto.getNgayBatDau())) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        if (dto.getTienThue() == null || dto.getTienThue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        if (dto.getTienCoc() != null && dto.getTienCoc().compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_HOP_DONG);
        }
        normalizeStatusOrDefault(dto.getTrangThai());
        if (bds != null && !TrangThaiBatDongSan.SAN_SANG_CHO_THUE.name().equals(bds.getTrangThai())) {
            throw new AppException(ErrorCode.INVALID_BAT_DONG_SAN);
        }
    }

    private HopDongThueRequestDTO mergeForValidation(HopDongThue entity, HopDongThueRequestDTO dto) {
        return HopDongThueRequestDTO.builder()
                .khachHangId(dto.getKhachHangId() != null ? dto.getKhachHangId() : entity.getKhachHang().getId())
                .batDongSanId(dto.getBatDongSanId() != null ? dto.getBatDongSanId() : entity.getBatDongSan().getId())
                .nhanVienMoiGioiId(dto.getNhanVienMoiGioiId() != null ? dto.getNhanVienMoiGioiId() : entity.getNhanVienMoiGioi().getId())
                .lichHenXemNhaId(dto.getLichHenXemNhaId())
                .ngayKy(dto.getNgayKy() != null ? dto.getNgayKy() : entity.getNgayKy())
                .ngayBatDau(dto.getNgayBatDau() != null ? dto.getNgayBatDau() : entity.getNgayBatDau())
                .ngayKetThuc(dto.getNgayKetThuc() != null ? dto.getNgayKetThuc() : entity.getNgayKetThuc())
                .tienThue(dto.getTienThue() != null ? dto.getTienThue() : entity.getTienThue())
                .tienCoc(dto.getTienCoc() != null ? dto.getTienCoc() : entity.getTienCoc())
                .trangThai(dto.getTrangThai() != null ? dto.getTrangThai() : entity.getTrangThai())
                .build();
    }

    private String normalizeInitialStatus(String status) {
        TrangThaiHopDong parsedStatus = status == null || status.isBlank()
                ? TrangThaiHopDong.NHAP
                : parseStatus(status);
        if (!INITIAL_STATUSES.contains(parsedStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        return parsedStatus.name();
    }

    private String normalizeStatusOrDefault(String status) {
        if (status == null || status.isBlank()) {
            return TrangThaiHopDong.NHAP.name();
        }
        return parseStatus(status).name();
    }

    private TrangThaiHopDong parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new AppException(ErrorCode.TRANG_THAI_KHONG_HOP_LE);
        }
        try {
            return TrangThaiHopDong.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.TRANG_THAI_KHONG_HOP_LE);
        }
    }

    private void validateViewingSchedule(Long lichHenXemNhaId, Long khachHangId, Long batDongSanId, Long nhanVienId) {
        if (lichHenXemNhaId == null) return;
        LichHenXemNha lich = lichHenXemNhaRepository.findById(lichHenXemNhaId)
                .orElseThrow(() -> new AppException(ErrorCode.LICH_HEN_NOT_FOUND));
        if (lich.getKhachHang() == null || !lich.getKhachHang().getId().equals(khachHangId)
                || lich.getBatDongSan() == null || !lich.getBatDongSan().getId().equals(batDongSanId)
                || lich.getNhanVien() == null || !lich.getNhanVien().getId().equals(nhanVienId)
                || !TrangThaiLichHen.DA_HOAN_THANH.name().equals(lich.getTrangThai())
                || !isAcceptedViewingResult(lich.getKetQua())) {
            throw new AppException(ErrorCode.INVALID_LICH_HEN);
        }
    }

    private void validatePropertyAvailableForCreate(Long batDongSanId) {
        if (hopDongThueRepository.existsActiveByBatDongSan(batDongSanId, ACTIVE_CONTRACT_STATUSES, LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_BAT_DONG_SAN);
        }
    }

    private void validatePropertyAvailableForSigning(Long batDongSanId, Long currentContractId) {
        boolean hasOtherActive = hopDongThueRepository.findByBatDongSanId(batDongSanId).stream()
                .anyMatch(h -> !h.getId().equals(currentContractId)
                        && ACTIVE_CONTRACT_STATUSES.contains(h.getTrangThai())
                        && (h.getNgayKetThuc() == null || !h.getNgayKetThuc().isBefore(LocalDate.now())));
        if (hasOtherActive) {
            throw new AppException(ErrorCode.INVALID_BAT_DONG_SAN);
        }
    }

    private boolean isAcceptedViewingResult(String ketQua) {
        if (ketQua == null) return false;
        String normalized = ketQua.trim().toUpperCase();
        return normalized.contains("DONG_Y_THUE")
                || normalized.contains("ĐỒNG Ý THUÊ")
                || normalized.contains("DONG Y THUE")
                || normalized.contains("CHOT_THUE")
                || normalized.contains("CHỐT THUÊ")
                || normalized.contains("CHOT THUE");
    }

    private void validateGenericStatusTransition(TrangThaiHopDong currentStatus, TrangThaiHopDong nextStatus) {
        if (TrangThaiHopDong.DA_KY.equals(nextStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        Set<TrangThaiHopDong> allowedNextStatuses = STATUS_TRANSITIONS.getOrDefault(currentStatus, Set.of());
        if (!allowedNextStatuses.contains(nextStatus)) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
    }

    private static Map<TrangThaiHopDong, Set<TrangThaiHopDong>> createStatusTransitions() {
        Map<TrangThaiHopDong, Set<TrangThaiHopDong>> transitions = new EnumMap<>(TrangThaiHopDong.class);
        transitions.put(TrangThaiHopDong.NHAP, EnumSet.of(TrangThaiHopDong.CHO_PHE_DUYET, TrangThaiHopDong.DA_HUY));
        transitions.put(TrangThaiHopDong.CHO_PHE_DUYET, EnumSet.of(TrangThaiHopDong.DA_PHE_DUYET, TrangThaiHopDong.TU_CHOI, TrangThaiHopDong.DA_HUY));
        transitions.put(TrangThaiHopDong.DA_PHE_DUYET, EnumSet.of(TrangThaiHopDong.DA_HUY));
        transitions.put(TrangThaiHopDong.DA_KY, EnumSet.of(TrangThaiHopDong.HOAN_THANH, TrangThaiHopDong.DA_HUY));
        transitions.put(TrangThaiHopDong.TU_CHOI, EnumSet.noneOf(TrangThaiHopDong.class));
        transitions.put(TrangThaiHopDong.HOAN_THANH, EnumSet.noneOf(TrangThaiHopDong.class));
        transitions.put(TrangThaiHopDong.DA_HUY, EnumSet.noneOf(TrangThaiHopDong.class));
        return transitions;
    }
}
