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
SELECT 'NHAN_VIEN_DAI_LY'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'NHAN_VIEN_DAI_LY'
);

INSERT INTO vai_tro (ten_vai_tro)
SELECT 'TU_VAN_PHAP_LUAT'
    WHERE NOT EXISTS (
    SELECT 1 FROM vai_tro WHERE ten_vai_tro = 'TU_VAN_PHAP_LUAT'
);

-- =========================================================
-- TAI_KHOAN + CHU_NHA
-- =========================================================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'chunha', '123456', 'ACTIVE', vt.id
FROM vai_tro vt
WHERE vt.ten_vai_tro = 'CHU_NHA'
  AND NOT EXISTS (
    SELECT 1 FROM tai_khoan WHERE username = 'chunha'
);

INSERT INTO chu_nha (tai_khoan_id, ho_ten, email, so_dien_thoai, cccd, dia_chi)
SELECT tk.id, 'Nguyen Van Chu Nha', 'chunha@gmail.com', '0900000001', '001122334455', 'Ha Noi'
FROM tai_khoan tk
WHERE tk.username = 'chunha'
  AND NOT EXISTS (
    SELECT 1 FROM chu_nha WHERE tai_khoan_id = tk.id
);

-- =========================================================
-- TAI_KHOAN + NHAN_VIEN (KE_TOAN)
-- =========================================================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'ketoan', '123456', 'ACTIVE', vt.id
FROM vai_tro vt
WHERE vt.ten_vai_tro = 'KE_TOAN'
  AND NOT EXISTS (
    SELECT 1 FROM tai_khoan WHERE username = 'ketoan'
);

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Ke Toan', 'ketoan@gmail.com', '0900000002', 'KE_TOAN'
FROM tai_khoan tk
WHERE tk.username = 'ketoan'
  AND NOT EXISTS (
    SELECT 1 FROM nhan_vien WHERE tai_khoan_id = tk.id
);

-- =========================================================
-- TAI_KHOAN + NHAN_VIEN (MOI_GIOI)
-- =========================================================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'moigioi', '123456', 'ACTIVE', vt.id
FROM vai_tro vt
WHERE vt.ten_vai_tro = 'MOI_GIOI'
  AND NOT EXISTS (
    SELECT 1 FROM tai_khoan WHERE username = 'moigioi'
);

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Nguyen Van Moi Gioi', 'moigioi@gmail.com', '0900000003', 'MOI_GIOI'
FROM tai_khoan tk
WHERE tk.username = 'moigioi'
  AND NOT EXISTS (
    SELECT 1 FROM nhan_vien WHERE tai_khoan_id = tk.id
);

-- =========================================================
-- TAI_KHOAN + KHACH_HANG
-- =========================================================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'khachhang', '123456', 'ACTIVE', vt.id
FROM vai_tro vt
WHERE vt.ten_vai_tro = 'KHACH_HANG'
  AND NOT EXISTS (
    SELECT 1 FROM tai_khoan WHERE username = 'khachhang'
);

INSERT INTO khach_hang (tai_khoan_id, ho_ten, email, so_dien_thoai, nhu_cau_thue)
SELECT tk.id, 'Nguyen Van Khach Hang', 'khachhang@gmail.com', '0900000004', 'Can nha nguyen can'
FROM tai_khoan tk
WHERE tk.username = 'khachhang'
  AND NOT EXISTS (
    SELECT 1 FROM khach_hang WHERE tai_khoan_id = tk.id
);

-- =========================================================
-- TAI_KHOAN + NHAN_VIEN (QUAN_TRI_VIEN)
-- =========================================================

INSERT INTO tai_khoan (username, password_hash, trang_thai, vai_tro_id)
SELECT 'admin', '123456', 'ACTIVE', vt.id
FROM vai_tro vt
WHERE vt.ten_vai_tro = 'QUAN_TRI_VIEN'
  AND NOT EXISTS (
    SELECT 1 FROM tai_khoan WHERE username = 'admin'
);

INSERT INTO nhan_vien (tai_khoan_id, ho_ten, email, so_dien_thoai, chuc_vu)
SELECT tk.id, 'Admin He Thong', 'admin@gmail.com', '0900000000', 'QUAN_TRI_VIEN'
FROM tai_khoan tk
WHERE tk.username = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM nhan_vien WHERE tai_khoan_id = tk.id
);
