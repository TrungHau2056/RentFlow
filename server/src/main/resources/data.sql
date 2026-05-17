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

-- =========================================================
-- CHU_NHA
-- =========================================================

INSERT INTO nguoi_dung (
    loai_nguoi_dung,
    ho_ten,
    email,
    so_dien_thoai,
    mat_khau_ma_hoa,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat,
    dia_chi,
    cccd_cmnd,
    ghi_chu
)
SELECT
    'CHU_NHA',
    'Nguyen Van Chu Nha',
    'chunha@gmail.com',
    '0900000001',
    '123456',
    'ACTIVE',
    NOW(),
    NOW(),
    'Ha Noi',
    '001122334455',
    'Chu nha mac dinh'
    WHERE NOT EXISTS (
    SELECT 1 FROM nguoi_dung WHERE email = 'chunha@gmail.com'
);

INSERT INTO phan_quyen_nguoi_dung (ma_nguoi_dung, ma_vai_tro)
SELECT nd.ma_nguoi_dung, vt.ma_vai_tro
FROM nguoi_dung nd
         JOIN vai_tro vt ON vt.ten_vai_tro = 'CHU_NHA'
WHERE nd.email = 'chunha@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM phan_quyen_nguoi_dung pq
    WHERE pq.ma_nguoi_dung = nd.ma_nguoi_dung
      AND pq.ma_vai_tro = vt.ma_vai_tro
);

-- =========================================================
-- KE_TOAN
-- =========================================================

INSERT INTO nguoi_dung (
    loai_nguoi_dung,
    ho_ten,
    email,
    so_dien_thoai,
    mat_khau_ma_hoa,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat,
    ngay_vao_lam
)
SELECT
    'KE_TOAN',
    'Nguyen Van Ke Toan',
    'ketoan@gmail.com',
    '0900000002',
    '123456',
    'ACTIVE',
    NOW(),
    NOW(),
    NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM nguoi_dung WHERE email = 'ketoan@gmail.com'
);

INSERT INTO phan_quyen_nguoi_dung (ma_nguoi_dung, ma_vai_tro)
SELECT nd.ma_nguoi_dung, vt.ma_vai_tro
FROM nguoi_dung nd
         JOIN vai_tro vt ON vt.ten_vai_tro = 'KE_TOAN'
WHERE nd.email = 'ketoan@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM phan_quyen_nguoi_dung pq
    WHERE pq.ma_nguoi_dung = nd.ma_nguoi_dung
      AND pq.ma_vai_tro = vt.ma_vai_tro
);

-- =========================================================
-- MOI_GIOI
-- =========================================================

INSERT INTO nguoi_dung (
    loai_nguoi_dung,
    ho_ten,
    email,
    so_dien_thoai,
    mat_khau_ma_hoa,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat,
    ty_le_hoa_hong,
    ngay_vao_lam
)
SELECT
    'MOI_GIOI',
    'Nguyen Van Moi Gioi',
    'moigioi@gmail.com',
    '0900000003',
    '123456',
    'ACTIVE',
    NOW(),
    NOW(),
    5.0,
    NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM nguoi_dung WHERE email = 'moigioi@gmail.com'
);

INSERT INTO phan_quyen_nguoi_dung (ma_nguoi_dung, ma_vai_tro)
SELECT nd.ma_nguoi_dung, vt.ma_vai_tro
FROM nguoi_dung nd
         JOIN vai_tro vt ON vt.ten_vai_tro = 'MOI_GIOI'
WHERE nd.email = 'moigioi@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM phan_quyen_nguoi_dung pq
    WHERE pq.ma_nguoi_dung = nd.ma_nguoi_dung
      AND pq.ma_vai_tro = vt.ma_vai_tro
);

-- =========================================================
-- KHACH_HANG
-- =========================================================

INSERT INTO nguoi_dung (
    loai_nguoi_dung,
    ho_ten,
    email,
    so_dien_thoai,
    mat_khau_ma_hoa,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat,
    loai_khach_hang,
    ma_moi_gioi,
    ngay_dang_ky,
    ngay_nang_cap
)
SELECT
    'KHACH_HANG',
    'Nguyen Van Khach Hang',
    'khachhang@gmail.com',
    '0900000004',
    '123456',
    'ACTIVE',
    NOW(),
    NOW(),
    'VIP',
    (
        SELECT ma_nguoi_dung
        FROM nguoi_dung
        WHERE email = 'moigioi@gmail.com'
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM nguoi_dung WHERE email = 'khachhang@gmail.com'
    );

INSERT INTO phan_quyen_nguoi_dung (ma_nguoi_dung, ma_vai_tro)
SELECT nd.ma_nguoi_dung, vt.ma_vai_tro
FROM nguoi_dung nd
         JOIN vai_tro vt ON vt.ten_vai_tro = 'KHACH_HANG'
WHERE nd.email = 'khachhang@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM phan_quyen_nguoi_dung pq
    WHERE pq.ma_nguoi_dung = nd.ma_nguoi_dung
      AND pq.ma_vai_tro = vt.ma_vai_tro
);

-- =========================================================
-- QUAN_TRI_VIEN
-- =========================================================

INSERT INTO nguoi_dung (
    loai_nguoi_dung,
    ho_ten,
    email,
    so_dien_thoai,
    mat_khau_ma_hoa,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat
)
SELECT
    'QUAN_TRI_VIEN',
    'Admin He Thong',
    'admin@gmail.com',
    '0900000000',
    '123456',
    'ACTIVE',
    NOW(),
    NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM nguoi_dung WHERE email = 'admin@gmail.com'
);

INSERT INTO phan_quyen_nguoi_dung (ma_nguoi_dung, ma_vai_tro)
SELECT nd.ma_nguoi_dung, vt.ma_vai_tro
FROM nguoi_dung nd
         JOIN vai_tro vt ON vt.ten_vai_tro = 'QUAN_TRI_VIEN'
WHERE nd.email = 'admin@gmail.com'
  AND NOT EXISTS (
    SELECT 1
    FROM phan_quyen_nguoi_dung pq
    WHERE pq.ma_nguoi_dung = nd.ma_nguoi_dung
      AND pq.ma_vai_tro = vt.ma_vai_tro
);