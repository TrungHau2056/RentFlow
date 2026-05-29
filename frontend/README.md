# RentFlow Frontend

Frontend cho RentFlow, nền tảng ký gửi và cho thuê bất động sản. Ứng dụng được xây bằng React + Vite, dùng React Router cho điều hướng và Tailwind CSS v4 cho giao diện.

## Mục lục

- [Công nghệ](#công-nghệ)
- [Chạy dự án](#chạy-dự-án)
- [Tài khoản demo](#tài-khoản-demo)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Luồng điều hướng](#luồng-điều-hướng)
- [Phân quyền và session](#phân-quyền-và-session)
- [Quy tắc truy cập theo role](#quy-tắc-truy-cập-theo-role)
- [Role nội bộ admin](#role-nội-bộ-admin)
- [Tích hợp API](#tích-hợp-api)
- [Quy ước phát triển](#quy-ước-phát-triển)
- [Checklist khi thêm màn hình](#checklist-khi-thêm-màn-hình)

## Công nghệ

- React `19`
- Vite `8`
- React Router DOM `7`
- Tailwind CSS `4` qua `@tailwindcss/vite`
- ESLint `10`

## Chạy dự án

Yêu cầu:

- Node.js bản LTS gần đây
- npm
- Backend chạy ở `http://localhost:8080` nếu muốn dùng API thật

Cài dependency:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

Kiểm tra lint:

```bash
npm run lint
```

## Tài khoản demo

FE đang hỗ trợ đăng nhập nhanh bằng dữ liệu mock trước khi gọi API thật.

| Vai trò | Email đăng nhập | Mật khẩu | Trang sau đăng nhập |
| --- | --- | --- | --- |
| Admin | `admin@rentflow.vn` | `123456` | `/admin` |
| Kế toán / Tài chính | `ketoan@rentflow.vn` | `123456` | `/admin/tien-dam-bao` |
| Pháp luật | `phapluat@rentflow.vn` | `123456` | `/admin/phap-luat` |
| Chủ nhà | `chunha@rentflow.vn` | `123456` | `/dashboard` |
| Khách thuê | `khachthue@rentflow.vn` | `123456` | `/tenant` |

Ghi chú: `AuthModal.jsx` và `LoginPage.jsx` đều ưu tiên tài khoản demo trước khi gọi API backend.

## Cấu trúc thư mục

```text
frontend/
  public/
    favicon.svg
    icons.svg
  src/
    assets/
      hero.png
      react.svg
      vite.svg
    components/
      AuthModal.jsx
    config/
      roles.js
    layouts/
      AdminLayout.jsx
      AuthLayout.jsx
      DashboardLayout.jsx
      TenantLayout.jsx
    pages/
      *.jsx
    App.jsx
    index.css
    main.jsx
  eslint.config.js
  package.json
  vite.config.js
```

Các điểm vào chính:

- `src/main.jsx`: mount React app, bọc `App` bằng `BrowserRouter`.
- `src/App.jsx`: khai báo toàn bộ route và redirect theo vai trò.
- `src/index.css`: import Tailwind, font, token màu, radius và animation dùng chung.
- `src/layouts/*`: layout bảo vệ route theo role, sidebar, header và logout.
- `src/pages/*`: từng màn hình nghiệp vụ.

## Luồng điều hướng

### Public

| Route | Component | Mục đích |
| --- | --- | --- |
| `/` | `HomeRoute` | Redirect user đã đăng nhập theo role, user chưa đăng nhập về `/home` |
| `/home` | `HomePage` | Trang chủ |
| `/login` | `LoginPage` | Đăng nhập dạng page |
| `/register` | `RegisterPage` | Đăng ký dạng page |
| `/bat-dong-san` | `BatDongSanPage` | Danh sách bất động sản (tìm kiếm, lọc, phân trang) |
| `/bat-dong-san/:id` | `ChiTietBatDongSanPage` | Guest xem được tóm tắt (loại, diện tích, giá, mô tả ngắn) + banner đăng nhập; thành viên xem đầy đủ (địa chỉ, gallery, liên hệ, đặt lịch) |

Ghi chú: `/bat-dong-san/dang-ky` không phải public route nghiệp vụ. Route này chỉ được giữ để redirect tương thích sang `/dashboard/bat-dong-san/dang-ky`, nơi `DangKyKyGuiPage` tự kiểm tra role và chỉ cho chủ nhà truy cập.

### Khách thuê

Các route này dùng `TenantLayout` và yêu cầu `userInfo.role === 'KHACH_THUE'`.

| Route | Component |
| --- | --- |
| `/tenant` | `TenantDashboardPage` |
| `/tenant/nha-da-luu` | `SavedPropertiesPage` |
| `/tenant/lich-xem` | `MyViewingSchedulePage` |
| `/tenant/dat-lich-xem` | `ScheduleViewingPage` (đọc `?propertyId=` từ URL) |
| `/tenant/thong-bao` | `NotificationsPage` |
| `/tenant/hop-dong` | `TenantContractsPage` |
| `/tenant/ho-so` | `TenantProfilePage` |

### Chủ nhà

Các route này dùng `DashboardLayout` và yêu cầu `userInfo.role === 'CHU_NHA'`.

| Route | Component |
| --- | --- |
| `/dashboard` | `DashboardPage` |
| `/dashboard/bat-dong-san` | `QuanLyBatDongSanPage` |
| `/dashboard/bat-dong-san/:id` | `ChiTietQuanLyBatDongSanPage` |
| `/dashboard/bat-dong-san/dang-ky` | `DangKyKyGuiPage` - chỉ chủ nhà được đăng ký ký gửi, form nhiều bước có validate, district lọc theo thành phố |
| `/dashboard/tien-dam-bao` | `TienDamBaoPage` - theo dõi tiền đảm bảo của bất động sản ký gửi |
| `/dashboard/tai-chinh` | Redirect | Redirect tương thích sang `/dashboard/tien-dam-bao` |
| `/dashboard/hop-dong` | `HopDongKyGuiPage` |
| `/dashboard/lich-khao-sat` | `LichKhaoSatPage` |
| `/dashboard/thong-bao` | `ThongBaoPage` |
| `/dashboard/hop-dong-ky-gui/:id` | `ChiTietHopDongKyGuiPage` |

### Admin / Nội bộ

Các route này dùng `AdminLayout`. `ADMIN` được truy cập đầy đủ; các role nội bộ khác chỉ thấy và truy cập những màn được cấp quyền.

| Route | Component |
| --- | --- |
| `/admin` | `AdminDashboardPage` |
| `/admin/chu-nha` | `AdminChuNhaPage` |
| `/admin/bat-dong-san` | `AdminBatDongSanPage` |
| `/admin/hop-dong-ky-gui` | `AdminHopDongKyGuiPage` |
| `/admin/hop-dong-thue` | `AdminHopDongThuePage` |
| `/admin/lich-khao-sat` | `AdminLichKhaoSatPage` |
| `/admin/lich-xem-nha` | `LichXemNhaPage` |
| `/admin/phan-cong-moi-gioi` | `PhanCongMoiGioiPage` |
| `/admin/hoa-hong` | `HoaHongPage` |
| `/admin/tien-dam-bao` | `TienDamBaoPage` |
| `/admin/bao-cao-thong-ke` | `BaoCaoThongKePage` |
| `/admin/phap-luat` | `LegalPage` |
| `/admin/tai-khoan` | `AccountManagementPage` |
| `/admin/khach-hang` | `CustomersPage` |
| `/admin/customers` | Redirect | Redirect tương thích sang `/admin/khach-hang` |
| `/admin/customers/:id` | `ChiTietKhachHangPage` |
| `/admin/hop-dong-ky-gui/:id` | `ChiTietHopDongKyGuiPage` |

## Phân quyền và session

Session hiện được lưu trong `localStorage`.

| Key | Mô tả |
| --- | --- |
| `accessToken` | JWT hoặc mock access token |
| `refreshToken` | Refresh token hoặc mock refresh token |
| `userInfo` | JSON user hiện tại, gồm `id`, `hoTen`, `email`, `role`, `avatar` |
| `rememberedIdentifier` | Tên đăng nhập được ghi nhớ trong `LoginPage` |
| `savedProperties` | Danh sách bất động sản khách thuê đã lưu |

Role FE đang dùng:

- `ADMIN`
- `KE_TOAN`
- `TU_VAN_PHAP_LUAT`
- `CHU_NHA`
- `KHACH_THUE`

Role nội bộ đã có mapping alias trong FE:

- `ADMIN` / `ROLE_ADMIN` / `QUAN_TRI_VIEN` / `ROLE_QUAN_TRI_VIEN`
- `KE_TOAN` / `ROLE_KE_TOAN` / `NHAN_VIEN_KE_TOAN` / `ROLE_NHAN_VIEN_KE_TOAN`
- `TU_VAN_PHAP_LUAT` / `ROLE_TU_VAN_PHAP_LUAT` / `BO_PHAN_PHAP_LUAT` / `ROLE_BO_PHAN_PHAP_LUAT`
- `NHAN_VIEN_DAI_LY` / `ROLE_NHAN_VIEN_DAI_LY`
- `MOI_GIOI` / `ROLE_MOI_GIOI`

Nếu backend trả về các role nội bộ này:

- `HomeRoute` redirect vào `/admin`.
- `AdminLayout` normalize role về nhóm quyền nội bộ.
- Sidebar chỉ hiển thị menu thuộc nhóm quyền đó.
- Nếu user nhập thẳng URL không thuộc quyền, layout hiển thị màn "Không có quyền truy cập".

Khách chưa đăng nhập được xem như khách thuê dạng guest:

- Được xem trang chủ và danh sách nhà cho thuê.
- Không thấy hành động đăng ký ký gửi.
- Khi mở chi tiết nhà, hệ thống yêu cầu đăng nhập/đăng ký trước khi hiển thị thông tin chi tiết, ảnh đầy đủ, thông tin liên hệ và thao tác đặt lịch.

Redirect sau đăng nhập:

- `ADMIN` -> `/admin`
- `CHU_NHA` -> `/dashboard`
- `KHACH_THUE` -> `/tenant` trực tiếp hoặc thông qua redirect từ `/`

Logout ở các layout sẽ xóa `accessToken`, `refreshToken`, `userInfo` rồi điều hướng về trang công khai.

## Quy tắc truy cập theo role

| Trạng thái user | Trang chủ | Danh sách nhà | Chi tiết nhà | Ký gửi nhà | Dashboard |
| --- | --- | --- | --- | --- | --- |
| Chưa đăng nhập | Được xem | Được xem (tìm kiếm, lọc, phân trang) | Xem được tóm tắt (loại, diện tích, giá, mô tả ngắn) + banner đăng nhập | Không hiện link, không được vào form | Không có |
| `KHACH_THUE` | Redirect về `/tenant` khi vào `/` | Được xem | Được xem chi tiết | Không hiện link, không được vào form | `/tenant` |
| `CHU_NHA` | Redirect về `/dashboard` khi vào `/` | Được xem | Được xem chi tiết | Được đăng ký ký gửi | `/dashboard` |
| `ADMIN` | Redirect về `/admin` khi vào `/` | Được xem | Được xem chi tiết | Không dùng flow ký gửi của chủ nhà | `/admin` |
| `KE_TOAN` | Redirect về `/admin/tien-dam-bao` | Được xem | Được xem chi tiết | Không được vào form | Nhóm tài chính |
| `TU_VAN_PHAP_LUAT` | Redirect về `/admin/phap-luat` | Được xem | Được xem chi tiết | Không được vào form | Nhóm pháp luật |

Nguyên tắc UI:

- Link "Ký gửi nhà" chỉ hiển thị khi `userInfo.role === 'CHU_NHA'`.
- `DangKyKyGuiPage` vẫn tự kiểm tra role để chặn truy cập trực tiếp bằng URL.
- Public property cards được phép link đến `/bat-dong-san/:id`. Guest xem được tóm tắt + banner đăng nhập; thành viên xem đầy đủ.
- Nếu thay đổi route chi tiết nhà, giữ behavior "guest xem summary, member xem detail".

## Role nội bộ admin

FE đã tách quyền truy cập nội bộ trong `AdminLayout` theo nhóm role:

| Role backend | Nhóm màn được truy cập | Màn mặc định |
| --- | --- | --- |
| `ADMIN`, `ROLE_ADMIN`, `QUAN_TRI_VIEN`, `ROLE_QUAN_TRI_VIEN` | Toàn bộ `/admin/*` | `/admin` |
| `KE_TOAN`, `ROLE_KE_TOAN`, `NHAN_VIEN_KE_TOAN`, `ROLE_NHAN_VIEN_KE_TOAN` | `/admin/tien-dam-bao`, `/admin/hoa-hong`, `/admin/bao-cao-thong-ke` | `/admin/tien-dam-bao` |
| `TU_VAN_PHAP_LUAT`, `BO_PHAN_PHAP_LUAT`, `ROLE_TU_VAN_PHAP_LUAT`, `ROLE_BO_PHAN_PHAP_LUAT` | `/admin/phap-luat`, `/admin/hop-dong-ky-gui`, `/admin/hop-dong-thue` | `/admin/phap-luat` |
| `NHAN_VIEN_DAI_LY`, `ROLE_NHAN_VIEN_DAI_LY` | `/admin/chu-nha`, `/admin/khach-hang`, `/admin/bat-dong-san`, `/admin/hop-dong-ky-gui`, `/admin/hop-dong-thue`, `/admin/lich-khao-sat`, `/admin/lich-xem-nha`, `/admin/phan-cong-moi-gioi` | `/admin/bat-dong-san` |
| `MOI_GIOI`, `ROLE_MOI_GIOI` | `/admin/khach-hang`, `/admin/lich-xem-nha` | `/admin/lich-xem-nha` |

Hành vi hiện tại nếu nhân viên kế toán/pháp luật đăng nhập:

1. Token và `userInfo` được lưu vào `localStorage`.
2. `HomeRoute` đưa user nội bộ vào `/admin`.
3. `AdminLayout` redirect `/admin` sang màn mặc định theo role.
4. Sidebar chỉ hiển thị các menu thuộc quyền của role.
5. Truy cập URL ngoài quyền sẽ bị chặn bằng màn "Không có quyền truy cập".

Khi triển khai phân quyền nội bộ, cần sửa đồng bộ:

- Cập nhật `ROLE_ALIASES`, `ROLE_HOME_PATHS`, `ROLE_ALLOWED_PATHS` và helper `isInternalAdminRole` trong `src/config/roles.js` nếu backend thêm role mới.
- Chuẩn hóa tên role FE nhận từ backend, vì tài liệu API có thể dùng cả dạng có tiền tố `ROLE_` và không có tiền tố.

## Tích hợp API

Base URL backend hiện đang hard-code trong một số màn:

```text
http://localhost:8080/api
```

Các API đã được gọi trực tiếp bằng `fetch`:

| File | Endpoint |
| --- | --- |
| `src/components/AuthModal.jsx` | `POST /api/auth/login`, `POST /api/auth/register` |
| `src/pages/LoginPage.jsx` | `POST /api/auth/login` |
| `src/pages/RegisterPage.jsx` | `POST /api/auth/register` |

Tài liệu API backend đang nằm ở:

- `../đặc tả API/A.md`: auth, chủ nhà, bất động sản, lịch khảo sát, hợp đồng ký gửi
- `../đặc tả API/D.md`: tài chính, tiền đảm bảo, hoa hồng, hoàn trả
- `../đặc tả API/E.md`: báo cáo, thống kê, phân quyền, tài khoản

Khi nối thêm API thật, nên gom cấu hình vào một lớp client dùng chung, ví dụ:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'
```

Sau đó truyền token:

```js
fetch(`${API_BASE_URL}/bat-dong-san`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
})
```

## Quy ước phát triển

- Component dùng function component và hook.
- Route mới được khai báo trong `src/App.jsx`.
- Màn có sidebar nên đặt dưới layout tương ứng thay vì tự dựng layout riêng.
- Style ưu tiên Tailwind utility class và token trong `src/index.css`.
- Dữ liệu mẫu nên đặt gần component đang dùng, đặt tên rõ như `MOCK_PROPERTIES`, `MOCK_CONTRACTS`.
- Không lưu logic gọi API rải rác lâu dài; khi bắt đầu nối backend nhiều màn, nên tạo thư mục `src/services` hoặc `src/api`.
- Khi thêm màn yêu cầu đăng nhập, kiểm tra role ở layout hoặc route parent.
- Khi thêm state lưu lâu dài, thống nhất key `localStorage` và dọn key khi logout nếu liên quan session.

## Checklist khi thêm màn hình

1. Tạo component page trong `src/pages`.
2. Thêm import và route trong `src/App.jsx`.
3. Nếu màn nằm trong sidebar, thêm item vào layout tương ứng.
4. Kiểm tra role cần truy cập.
5. Nếu dùng API, thêm handling cho loading, empty, error.
6. Chạy `npm run lint`.
7. Chạy `npm run build` trước khi bàn giao.

## Ghi chú hiện trạng

- Một số màn vẫn dùng dữ liệu mock để dựng UI.
- Base URL API chưa lấy từ biến môi trường.
- Chưa có test tự động cho FE.
- Một số link trong sidebar admin/chủ nhà có thể là màn dự kiến nhưng chưa có route tương ứng, ví dụ `/admin/cai-dat`, `/dashboard/ho-so`.
- Dữ liệu mock dùng địa chỉ Hà Nội (Ba Đình, Cầu Giấy, Thanh Xuân, Tây Hồ...). District trong form ký gửi lọc theo thành phố (`DISTRICTS_BY_CITY`).
- Ngày tháng trong mock data dùng `new Date()` thay vì hardcode để luôn hiển thị đúng "hôm nay".
