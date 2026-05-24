package com.rentflow.server.dto.response.quantri;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoanNhanVienResponseDTO {
    private Long id;
    private String username;
    private String trangThai;
    private String tenVaiTro;
    private Long nhanVienId;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String chucVu;
}
