-- =========================
-- VAI_TRO
-- =========================

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'CHU_NHA'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'CHU_NHA'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'KE_TOAN'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'KE_TOAN'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'KHACH_HANG'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'KHACH_HANG'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'MOI_GIOI'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'MOI_GIOI'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'QUAN_TRI_VIEN'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'QUAN_TRI_VIEN'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'BO_PHAN_PHAP_LUAT'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'BO_PHAN_PHAP_LUAT'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'NHAN_VIEN_DAI_LY'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'NHAN_VIEN_DAI_LY'
);

-- =========================
-- TAI_KHOAN + CHU_NHA
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'chunha@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'CHU_NHA'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'chunha@gmail.com');

INSERT INTO chu_nha (tai_khoan_id, ho_ten, so_dien_thoai, email, cccd, dia_chi)
SELECT tk.id, 'Nguyen Van Chu Nha', '0900000001', 'chunha@gmail.com', '001122334455', 'Ha Noi'
FROM tai_khoan tk WHERE tk.username = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM chu_nha WHERE email = 'chunha@gmail.com');

-- =========================
-- TAI_KHOAN + NHAN_VIEN (KE_TOAN)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'ketoan@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'KE_TOAN'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'ketoan@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Ke Toan', 'ketoan@gmail.com', '0900000002', 'KE_TOAN'
FROM tai_khoan tk WHERE tk.username = 'ketoan@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'ketoan@gmail.com');

-- =========================
-- TAI_KHOAN + NHAN_VIEN (MOI_GIOI)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'moigioi@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'MOI_GIOI'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'moigioi@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Moi Gioi', 'moigioi@gmail.com', '0900000003', 'MOI_GIOI'
FROM tai_khoan tk WHERE tk.username = 'moigioi@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'moigioi@gmail.com');

-- =========================
-- TAI_KHOAN + KHACH_HANG
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'khachhang@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'KHACH_HANG'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'khachhang@gmail.com');

INSERT INTO khach_hang (tai_khoan_id, ho_ten, so_dien_thoai, email, nhu_cau_thue)
SELECT tk.id, 'Nguyen Van Khach Hang', '0900000004', 'khachhang@gmail.com', 'Can thue nha o'
FROM tai_khoan tk WHERE tk.username = 'khachhang@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM khach_hang WHERE email = 'khachhang@gmail.com');

-- =========================
-- TAI_KHOAN + QUAN_TRI_VIEN
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'admin@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'QUAN_TRI_VIEN'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'admin@gmail.com');

-- =========================
-- TAI_KHOAN + NHAN_VIEN (NHAN_VIEN_DAI_LY)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'nhanviendaily@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'NHAN_VIEN_DAI_LY'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'nhanviendaily@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Nhan Vien Dai Ly', 'nhanviendaily@gmail.com', '0900000005', 'NHAN_VIEN_DAI_LY'
FROM tai_khoan tk WHERE tk.username = 'nhanviendaily@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'nhanviendaily@gmail.com');

-- =========================
-- TAI_KHOAN + NHAN_VIEN (BO_PHAN_PHAP_LUAT)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'phaply@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'BO_PHAN_PHAP_LUAT'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'phaply@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Bo Phan Phap Ly', 'phaply@gmail.com', '0900000006', 'PHAP_LUAT'
FROM tai_khoan tk WHERE tk.username = 'phaply@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'phaply@gmail.com');

-- =========================
-- THÊM NHAN_VIEN (MOI_GIOI)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'broker2@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'MOI_GIOI'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'broker2@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Tran Van Hung', 'broker2@gmail.com', '0900000010', 'MOI_GIOI'
FROM tai_khoan tk WHERE tk.username = 'broker2@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'broker2@gmail.com');

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'broker3@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'MOI_GIOI'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'broker3@gmail.com');

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Pham Minh Tuan', 'broker3@gmail.com', '0900000011', 'MOI_GIOI'
FROM tai_khoan tk WHERE tk.username = 'broker3@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM nhan_vien WHERE email = 'broker3@gmail.com');

-- =========================
-- BẤT ĐỘNG SẢN
-- =========================

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, trang_thai)
SELECT cn.id, '123 Nguyễn Huệ, Quận 1', 80, 15000000, 'Căn hộ chung cư cao cấp, 2 phòng ngủ', 'CHUNG_CU', 'DANG_CHO'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = '123 Nguyễn Huệ, Quận 1');

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, trang_thai)
SELECT cn.id, '45 Lê Lợi, Quận 3', 120, 25000000, 'Nhà mặt phố kinh doanh, 4 tầng', 'NHA_O', 'DA_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = '45 Lê Lợi, Quận 3');

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, trang_thai)
SELECT cn.id, '78 Nguyễn Văn Linh, Quận 7', 90, 18000000, 'Căn hộ view sông, 3 phòng ngủ', 'CHUNG_CU', 'DANG_CHO'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = '78 Nguyễn Văn Linh, Quận 7');

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, trang_thai)
SELECT cn.id, '15 Hoàng Diệu, Quận 4', 200, 35000000, 'Biệt thự mini, hồ bơi', 'BIET_THU', 'DA_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = '15 Hoàng Diệu, Quận 4');

-- =========================
-- HỢP ĐỒNG KÝ GỬI
-- =========================

INSERT INTO hop_dong_ky_gui (chu_nha_id, bat_dong_san_id, nhan_vien_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_dam_bao, trang_thai)
SELECT cn.id, bds.id, nv.id, '2026-01-15', '2026-01-15', '2026-07-15', 5000000, 'DA_CO_KHACH_THUE'
FROM chu_nha cn, bat_dong_san bds, nhan_vien nv
WHERE cn.email = 'chunha@gmail.com' AND bds.dia_chi = '45 Lê Lợi, Quận 3' AND nv.email = 'moigioi@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_ky_gui WHERE bat_dong_san_id = bds.id);

INSERT INTO hop_dong_ky_gui (chu_nha_id, bat_dong_san_id, nhan_vien_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_dam_bao, trang_thai)
SELECT cn.id, bds.id, nv.id, '2026-03-01', '2026-03-01', '2026-09-01', 3000000, 'DANG_HOAT_DONG'
FROM chu_nha cn, bat_dong_san bds, nhan_vien nv
WHERE cn.email = 'chunha@gmail.com' AND bds.dia_chi = '123 Nguyễn Huệ, Quận 1' AND nv.email = 'broker2@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_ky_gui WHERE bat_dong_san_id = bds.id);

INSERT INTO hop_dong_ky_gui (chu_nha_id, bat_dong_san_id, nhan_vien_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_dam_bao, trang_thai)
SELECT cn.id, bds.id, nv.id, '2026-05-20', '2026-05-20', '2026-11-20', 4000000, 'DANG_HOAT_DONG'
FROM chu_nha cn, bat_dong_san bds, nhan_vien nv
WHERE cn.email = 'chunha@gmail.com' AND bds.dia_chi = '78 Nguyễn Văn Linh, Quận 7' AND nv.email = 'broker3@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_ky_gui WHERE bat_dong_san_id = bds.id);

INSERT INTO hop_dong_ky_gui (chu_nha_id, bat_dong_san_id, nhan_vien_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_dam_bao, trang_thai)
SELECT cn.id, bds.id, nv.id, '2026-06-01', '2026-06-01', '2026-12-01', 6000000, 'DANG_HOAT_DONG'
FROM chu_nha cn, bat_dong_san bds, nhan_vien nv
WHERE cn.email = 'chunha@gmail.com' AND bds.dia_chi = '15 Hoàng Diệu, Quận 4' AND nv.email = 'moigioi@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_ky_gui WHERE bat_dong_san_id = bds.id);

-- =========================
-- HỢP ĐỒNG THUÊ
-- =========================

INSERT INTO hop_dong_thue (khach_hang_id, bat_dong_san_id, nhan_vien_moi_gioi_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_thue, tien_coc, trang_thai)
SELECT kh.id, bds.id, nv.id, '2026-02-01', '2026-02-01', '2027-02-01', 25000000, 50000000, 'HIEU_LUC'
FROM khach_hang kh, bat_dong_san bds, nhan_vien nv
WHERE kh.email = 'khachhang@gmail.com' AND bds.dia_chi = '45 Lê Lợi, Quận 3' AND nv.email = 'moigioi@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_thue WHERE bat_dong_san_id = bds.id);

INSERT INTO hop_dong_thue (khach_hang_id, bat_dong_san_id, nhan_vien_moi_gioi_id, ngay_ky, ngay_bat_dau, ngay_ket_thuc, tien_thue, tien_coc, trang_thai)
SELECT kh.id, bds.id, nv.id, '2026-04-01', '2026-04-01', '2027-04-01', 35000000, 70000000, 'HIEU_LUC'
FROM khach_hang kh, bat_dong_san bds, nhan_vien nv
WHERE kh.email = 'khachhang@gmail.com' AND bds.dia_chi = '15 Hoàng Diệu, Quận 4' AND nv.email = 'broker2@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hop_dong_thue WHERE bat_dong_san_id = bds.id);

-- =========================
-- GIAO DỊCH TÀI CHÍNH (TIỀN ĐẢM BẢO)
-- =========================

INSERT INTO giao_dich_tai_chinh (nhan_vien_ke_toan_id, hop_dong_ky_gui_id, loai_giao_dich, so_tien, ngay_giao_dich, trang_thai)
SELECT nv.id, hdkg.id, 'TIEN_DAM_BAO', hdkg.tien_dam_bao, '2026-01-15T10:00:00', 'HOAN_THANH'
FROM nhan_vien nv, hop_dong_ky_gui hdkg
WHERE nv.email = 'ketoan@gmail.com' AND hdkg.tien_dam_bao = 5000000
    AND NOT EXISTS (SELECT 1 FROM giao_dich_tai_chinh WHERE hop_dong_ky_gui_id = hdkg.id AND loai_giao_dich = 'TIEN_DAM_BAO');

INSERT INTO giao_dich_tai_chinh (nhan_vien_ke_toan_id, hop_dong_ky_gui_id, loai_giao_dich, so_tien, ngay_giao_dich, trang_thai)
SELECT nv.id, hdkg.id, 'TIEN_DAM_BAO', hdkg.tien_dam_bao, '2026-03-01T10:00:00', 'HOAN_THANH'
FROM nhan_vien nv, hop_dong_ky_gui hdkg
WHERE nv.email = 'ketoan@gmail.com' AND hdkg.tien_dam_bao = 3000000
    AND NOT EXISTS (SELECT 1 FROM giao_dich_tai_chinh WHERE hop_dong_ky_gui_id = hdkg.id AND loai_giao_dich = 'TIEN_DAM_BAO');

INSERT INTO giao_dich_tai_chinh (nhan_vien_ke_toan_id, hop_dong_ky_gui_id, loai_giao_dich, so_tien, ngay_giao_dich, trang_thai)
SELECT nv.id, hdkg.id, 'TIEN_DAM_BAO', hdkg.tien_dam_bao, '2026-05-20T10:00:00', 'HOAN_THANH'
FROM nhan_vien nv, hop_dong_ky_gui hdkg
WHERE nv.email = 'ketoan@gmail.com' AND hdkg.tien_dam_bao = 4000000
    AND NOT EXISTS (SELECT 1 FROM giao_dich_tai_chinh WHERE hop_dong_ky_gui_id = hdkg.id AND loai_giao_dich = 'TIEN_DAM_BAO');

INSERT INTO giao_dich_tai_chinh (nhan_vien_ke_toan_id, hop_dong_ky_gui_id, loai_giao_dich, so_tien, ngay_giao_dich, trang_thai)
SELECT nv.id, hdkg.id, 'TIEN_DAM_BAO', hdkg.tien_dam_bao, '2026-06-01T10:00:00', 'CHO_XU_LY'
FROM nhan_vien nv, hop_dong_ky_gui hdkg
WHERE nv.email = 'ketoan@gmail.com' AND hdkg.tien_dam_bao = 6000000
    AND NOT EXISTS (SELECT 1 FROM giao_dich_tai_chinh WHERE hop_dong_ky_gui_id = hdkg.id AND loai_giao_dich = 'TIEN_DAM_BAO');

-- =========================
-- HOA HỒNG
-- =========================

INSERT INTO hoa_hong (hop_dong_thue_id, nhan_vien_moi_gioi_id, so_tien, ngay_tinh, trang_thai_thanh_toan)
SELECT hdt.id, nv.id, 3750000, '2026-02-15', 'DA_THANH_TOAN'
FROM hop_dong_thue hdt, nhan_vien nv
WHERE hdt.tien_thue = 25000000 AND nv.email = 'moigioi@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hoa_hong WHERE hop_dong_thue_id = hdt.id);

INSERT INTO hoa_hong (hop_dong_thue_id, nhan_vien_moi_gioi_id, so_tien, ngay_tinh, trang_thai_thanh_toan)
SELECT hdt.id, nv.id, 5250000, '2026-04-15', 'CHUA_THANH_TOAN'
FROM hop_dong_thue hdt, nhan_vien nv
WHERE hdt.tien_thue = 35000000 AND nv.email = 'broker2@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM hoa_hong WHERE hop_dong_thue_id = hdt.id);