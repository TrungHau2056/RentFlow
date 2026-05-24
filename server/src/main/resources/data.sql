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