# RentFlow

Hệ thống quản lý ký gửi và cho thuê bất động sản tại Hà Nội.

## Tổng quan

RentFlow là nền tảng SaaS quản lý ký gửi và cho thuê bất động sản, gồm 3 cổng:

- **Cổng khách hàng** — Duyệt BĐS, đặt lịch xem, quản lý hợp đồng thuê
- **Cổng chủ nhà** — Đăng ký ký gửi, quản lý BĐS, hợp đồng, lịch khảo sát
- **Cổng quản trị nội bộ** — Quản lý chủ nhà, khách hàng, BĐS, hợp đồng, phân công môi giới, hoa hồng, pháp luật, báo cáo

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 + Tailwind CSS 4 + React Router DOM 7 |
| Backend | Spring Boot 4.0.6 + Java 17 + Maven |
| Database | PostgreSQL 16 (Docker, port 5435) |
| Auth | JWT + OAuth2 Resource Server |
| API Docs | SpringDoc OpenAPI 3.0 (Swagger UI) |
| Font | Plus Jakarta Sans (hỗ trợ tiếng Việt) |

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev      # Dev server tại http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint check
```

### Backend

```bash
# 1. Khởi động PostgreSQL
docker compose up -d

# 2. Chạy server
cd server
./mvnw spring-boot:run

# 3. Swagger UI
# http://localhost:8080/swagger-ui.html
```

## Cấu trúc dự án

```
RentFlow/
├── frontend/
│   └── src/
│       ├── main.jsx              # Entry point, BrowserRouter
│       ├── App.jsx               # Role-based routing
│       ├── index.css             # Tailwind + @theme tokens
│       ├── config/
│       │   ├── roles.js          # Role aliases, allowed paths, normalizeInternalRole
│       │   └── mockUsers.js      # 7 demo accounts (mỗi role 1 account)
│       ├── layouts/
│       │   ├── AdminLayout.jsx   # Dark sidebar, sectioned menu, role filtering
│       │   ├── DashboardLayout.jsx # CHU_NHA sidebar
│       │   ├── TenantLayout.jsx  # KHACH_HANG sidebar, w-72, mobile drawer
│       │   └── AuthLayout.jsx    # Split-screen login/register
│       ├── pages/                # ~50 trang JSX
│       ├── components/
│       │   ├── Header.jsx        # Shared header with search, mobile menu
│       │   ├── AuthModal.jsx     # Login/register modal
│       │   └── ProtectedRoute.jsx
│       └── services/             # 14 API service files (axios wrapper)
├── server/
│   └── src/main/java/com/rentflow/server/
│       ├── ServerApplication.java            # Main class
│       ├── config/                           # Security (JWT), CORS, OpenAPI, TaiChinh
│       │   └── security/
│       │       ├── SecurityConfig.java       # JWT + OAuth2 resource server
│       │       └── CustomJwtDecoder.java
│       ├── controller/                       # 13 REST controllers
│       │   ├── AuthController.java           # /api/auth/*
│       │   ├── BatDongSanController.java     # /api/bat-dong-san/* (authenticated)
│       │   ├── BatDongSanPublicController.java # /api/bat-dong-san/cong-khai/* (public)
│       │   ├── ChuNhaController.java         # /api/chu-nha/*
│       │   ├── KhachHangController.java      # /api/khach-hang/*
│       │   ├── HopDongKyGuiController.java   # /api/hop-dong-ky-gui/*
│       │   ├── HopDongThueController.java    # /api/hop-dong-thue/*
│       │   ├── LichHenKhaoSatController.java # /api/lich-hen-khao-sat/*
│       │   ├── LichHenXemNhaController.java  # /api/lich-hen-xem-nha/*
│       │   ├── NhanVienMoiGioiController.java # /api/nhan-vien-moi-gioi/*
│       │   ├── QuanTriController.java        # /api/quan-tri/*
│       │   ├── TaiChinhController.java       # /api/tai-chinh/*
│       │   └── BaoCaoController.java         # /api/bao-cao/*
│       ├── service/                          # 15 service classes
│       ├── repository/                       # 13 Spring Data JPA repositories
│       ├── entity/                           # 13 JPA entities
│       ├── dto/
│       │   ├── request/                      # 18 request DTOs
│       │   └── response/                     # 15+ response DTOs (auth, baocao, quantri, taichinh)
│       ├── exception/                        # AppException, AuthException, GlobalExceptionHandler
│       └── util/
│           ├── SecurityUtils.java
│           └── enums/                        # TrangThai*, LoaiGiaoDich, ErrorCode, TokenType
├── docker-compose.yml          # PostgreSQL 16 trên port 5435
├── đặc tả API/                 # API specification docs
├── UI/                         # UI/UX design references
└── CLAUDE.md                   # Detailed architecture & conventions
```

## Role System

5 nhóm admin nội bộ + 2 role外部:

| Role Group | Aliases | Home Path |
|---|---|---|
| ADMIN | ADMIN, QUAN_TRI_VIEN | `/admin` |
| FINANCE | KE_TOAN, NHAN_VIEN_KE_TOAN | `/admin/tien-dam-bao` |
| LEGAL | TU_VAN_PHAP_LUAT, BO_PHAN_PHAP_LUAT | `/admin/phap-luat` |
| AGENCY | NHAN_VIEN_DAI_LY | `/admin/bat-dong-san` |
| BROKER | MOI_GIOI | `/admin/lich-xem-nha` |
| CHU_NHA | — | `/dashboard` |
| KHACH_HANG | — | `/tenant` |

## Demo Accounts

| Email | Password | Role |
|---|---|---|
| admin@rentflow.vn | 123456 | ADMIN |
| ketoan@rentflow.vn | 123456 | KE_TOAN |
| phapluat@rentflow.vn | 123456 | BO_PHAN_PHAP_LUAT |
| daily@rentflow.vn | 123456 | NHAN_VIEN_DAI_LY |
| moigioi@rentflow.vn | 123456 | MOI_GIOI |
| chunha@rentflow.vn | 123456 | CHU_NHA |
| khachhang@rentflow.vn | 123456 | KHACH_HANG |
