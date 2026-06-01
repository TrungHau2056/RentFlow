package com.rentflow.server.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả kiểm tra điều kiện lập hợp đồng thuê")
public class HopDongThueEligibilityResponseDTO {
    private boolean eligible;
    private List<String> failedConditions;
    private Long lichHenXemNhaId;
    private Long khachHangId;
    private String tenKhachHang;
    private Long batDongSanId;
    private String diaChiBatDongSan;
    private String trangThaiBatDongSan;
    private Long nhanVienMoiGioiId;
    private String tenNhanVienMoiGioi;
    private Double giaThueDeXuat;
}
