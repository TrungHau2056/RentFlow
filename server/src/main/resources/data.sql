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
-- TAI_KHOAN + KHACH_HANG (bổ sung)
-- =========================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'nguyenvanA@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'KHACH_HANG'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'nguyenvanA@gmail.com');

INSERT INTO khach_hang (tai_khoan_id, ho_ten, so_dien_thoai, email, nhu_cau_thue)
SELECT tk.id, 'Nguyen Van A', '0900000021', 'nguyenvanA@gmail.com', 'Can tim can ho chung cu'
FROM tai_khoan tk WHERE tk.username = 'nguyenvanA@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM khach_hang WHERE email = 'nguyenvanA@gmail.com');

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'nguyenvanB@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'KHACH_HANG'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'nguyenvanB@gmail.com');

INSERT INTO khach_hang (tai_khoan_id, ho_ten, so_dien_thoai, email, nhu_cau_thue)
SELECT tk.id, 'Nguyen Van B', '0900000022', 'nguyenvanB@gmail.com', 'Can thue nha rieng'
FROM tai_khoan tk WHERE tk.username = 'nguyenvanB@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM khach_hang WHERE email = 'nguyenvanB@gmail.com');

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'nguyenvanC@gmail.com', '123456', 'ACTIVE', vt.id
FROM vai_tro vt WHERE vt.ten_vai_tro = 'KHACH_HANG'
    AND NOT EXISTS (SELECT 1 FROM tai_khoan WHERE username = 'nguyenvanC@gmail.com');

INSERT INTO khach_hang (tai_khoan_id, ho_ten, so_dien_thoai, email, nhu_cau_thue)
SELECT tk.id, 'Nguyen Van C', '0900000023', 'nguyenvanC@gmail.com', 'Can thue biet thu'
FROM tai_khoan tk WHERE tk.username = 'nguyenvanC@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM khach_hang WHERE email = 'nguyenvanC@gmail.com');

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
-- BAT_DONG_SAN (data mock)
-- =========================

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Hoàn Kiếm, Hà Nội', 320, 45000000, 'Biệt thự cổ kính, không gian xanh, gần Hồ Gươm', 'Biệt thự', 'Đông Nam', 4, 5, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Hoàn Kiếm, Hà Nội' AND gia_thue = 45000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Tây Hồ, Hà Nội', 150, 28000000, 'View hồ toàn cảnh, nội thất hiện đại', 'Căn hộ', 'Đông Bắc', 3, 2, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Tây Hồ, Hà Nội' AND gia_thue = 28000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Cầu Giấy, Hà Nội', 120, 22000000, 'Mặt phố kinh doanh, giao thông thuận tiện', 'Nhà riêng', 'Tây Nam', 3, 2, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Cầu Giấy, Hà Nội' AND gia_thue = 22000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Ba Đình, Hà Nội', 200, 55000000, 'Tầng thượng, sân vườn riêng, thang máy', 'Căn hộ', 'Nam', 3, 3, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Ba Đình, Hà Nội' AND gia_thue = 55000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Cầu Giấy, Hà Nội', 45, 12000000, 'Full nội thất, phù hợp người độc thân', 'Studio', 'Đông', 1, 1, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Cầu Giấy, Hà Nội' AND gia_thue = 12000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Nam Từ Liêm, Hà Nội', 85, 18000000, 'Hẻm xe hơi, khu dân cư an ninh', 'Nhà riêng', 'Tây', 3, 2, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Nam Từ Liêm, Hà Nội' AND gia_thue = 18000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Thanh Xuân, Hà Nội', 110, 35000000, 'Khu đô thị hiện đại, tiện ích đầy đủ', 'Căn hộ', 'Đông Nam', 3, 2, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Thanh Xuân, Hà Nội' AND gia_thue = 35000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Hà Đông, Hà Nội', 250, 40000000, 'Sân vườn rộng, garage ô tô, yên tĩnh', 'Biệt thự', 'Đông Nam', 5, 4, 'SAN_SANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Hà Đông, Hà Nội' AND gia_thue = 40000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Vinhomes Riverside, Long Biên, Hà Nội', 95, 15000000, 'Căn hộ 2PN tại khu đô thị Vinhomes Riverside, tiện ích đầy đủ', 'Căn hộ', 'Đông Nam', 2, 2, 'DANG_CHO_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Vinhomes Riverside, Long Biên, Hà Nội' AND gia_thue = 15000000);

INSERT INTO bat_dong_san (chu_nha_id, dia_chi, dien_tich, gia_thue, mo_ta, loai_nha, huong, so_phong_ngu, so_phong_ve_sinh, trang_thai)
SELECT cn.id, 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội', 450, 65000000, 'Biệt thự sân vườn rộng, garage 2 ô tô, hồ bơi riêng', 'Biệt thự', 'Đông', 5, 4, 'DA_THUE'
FROM chu_nha cn WHERE cn.email = 'chunha@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM bat_dong_san WHERE dia_chi = 'Nguyễn Văn Hưởng, Tây Hồ, Hà Nội' AND gia_thue = 65000000);

