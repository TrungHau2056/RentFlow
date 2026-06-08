# RentFlow

Hệ thống quản lý ký gửi và cho thuê bất động sản tại Hà Nội.

## Tổng quan

RentFlow là nền tảng quản lý ký gửi và cho thuê bất động sản, gồm 3 cổng:

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

## Yêu cầu

- **Java 17** (JDK 17)
- **Node.js** 18+
- **Docker** (cho PostgreSQL)

## Quick Start

### 1. Khởi động PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd server
./mvnw spring-boot:run
```

Server chạy tại `http://localhost:8081`

Swagger UI: `http://localhost:8081/swagger-ui.html`

> **Lưu ý:** Nếu gặp lỗi `UnsupportedClassVersionError`, chạy `./mvnw clean` trước khi chạy lại.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server tại `http://localhost:5173`

## Cấu trúc dự án

```
RentFlow/
├── frontend/
│   └── src/
│       ├── main.jsx               # Entry point, BrowserRouter
│       ├── App.jsx                # Role-based routing
│       ├── index.css              # Tailwind + @theme tokens
│       ├── config/
│       │   ├── roles.js           # Role aliases, allowed paths
│       │   └── mockUsers.js       # 7 demo accounts
│       ├── layouts/
│       │   ├── AdminLayout.jsx    # Dark sidebar, sectioned menu
│       │   ├── DashboardLayout.jsx # CHU_NHA sidebar
│       │   ├── TenantLayout.jsx   # KHACH_HANG sidebar
│       │   └── AuthLayout.jsx     # Split-screen login/register
│       ├── pages/                 # ~40 trang JSX
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── AuthModal.jsx
│       │   └── ProtectedRoute.jsx
│       └── services/              # 15 API service files (axios wrapper)
├── server/
│   └── src/main/java/com/rentflow/server/
│       ├── ServerApplication.java
│       ├── config/                # Security (JWT), CORS, OpenAPI
│       │   └── security/
│       │       ├── SecurityConfig.java
│       │       └── CustomJwtDecoder.java
│       ├── controller/            # 13 REST controllers
│       ├── service/               # 15 service classes
│       ├── repository/            # 13 Spring Data JPA repositories
│       ├── entity/                # 13 JPA entities
│       ├── dto/
│       │   ├── request/           # Request DTOs
│       │   └── response/          # Response DTOs
│       ├── exception/             # AppException, GlobalExceptionHandler
│       └── util/                  # SecurityUtils, enums
├── docker-compose.yml             # PostgreSQL 16 trên port 5435
├── đặc tả API/                    # API specification docs
└── UI/                            # UI/UX design references
```

## Role System

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

## API Endpoints

| Endpoint | Controller | Auth |
|---|---|---|
| `/api/auth/*` | AuthController | Public |
| `/api/bat-dong-san/cong-khai/*` | BatDongSanPublicController | Public |
| `/api/bat-dong-san/*` | BatDongSanController | Authenticated |
| `/api/chu-nha/*` | ChuNhaController | Authenticated |
| `/api/khach-hang/*` | KhachHangController | Authenticated |
| `/api/hop-dong-ky-gui/*` | HopDongKyGuiController | Authenticated |
| `/api/hop-dong-thue/*` | HopDongThueController | Authenticated |
| `/api/lich-hen-khao-sat/*` | LichHenKhaoSatController | Authenticated |
| `/api/lich-hen-xem-nha/*` | LichHenXemNhaController | Authenticated |
| `/api/nhan-vien-moi-gioi/*` | NhanVienMoiGioiController | Authenticated |
| `/api/quan-tri/*` | QuanTriController | Authenticated |
| `/api/tai-chinh/*` | TaiChinhController | Authenticated |
| `/api/bao-cao/*` | BaoCaoController | Authenticated |
