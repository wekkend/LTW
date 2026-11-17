# LapManager – Quản lý laptop ThinkPad

Đồ án môn Lập trình Web.

- **Frontend:** React 19 + Vite + react-router + Axios (`thinkpad-manager/`)
- **Backend:** ASP.NET Core Web API (.NET 10) + EF Core 10 (`backend/ThinkPadManager.Api/`)
- **Database:** SQL Server (Express)

Giải thích kiến trúc, luồng hoạt động và danh sách API: xem [ARCHITECTURE.md](ARCHITECTURE.md).

## Yêu cầu cài đặt

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org) 20 trở lên
- SQL Server Express (instance `.\SQLEXPRESS`) – nếu tên khác, sửa `ConnectionStrings:Default` trong `backend/ThinkPadManager.Api/appsettings.json`
- Công cụ EF Core: `dotnet tool install --global dotnet-ef --version "10.*"`

## Chạy dự án

**1. Tạo database** (chỉ làm lần đầu, tự tạo DB + bảng + dữ liệu mẫu):

```powershell
cd backend/ThinkPadManager.Api
dotnet ef database update
```

**2. Chạy backend** (http://localhost:5159, Swagger tại `/swagger`):

```powershell
cd backend/ThinkPadManager.Api
dotnet run --launch-profile http
```

**3. Chạy frontend** (http://localhost:3000), mở terminal khác:

```powershell
cd thinkpad-manager
copy .env.example .env
npm install
npm run dev
```

## Các trang

| URL | Nội dung |
|---|---|
| `/` | Trang chủ, thống kê |
| `/laptops`, `/laptops/:seriesId` | Danh sách, lọc, sắp xếp, tìm kiếm |
| `/laptop/:id` | Chi tiết, đổi trạng thái, xóa |
| `/about-us`, `/contact` | Giới thiệu, liên hệ |
| `/admin/laptops` | Quản lý: thêm, sửa, xóa |

## API chính

`GET/POST /api/laptops` · `GET/PUT/DELETE /api/laptops/{id}` · `GET /api/series` · `GET /api/stats` · `POST /api/contact`

## Ảnh sản phẩm

Đặt ảnh vào `thinkpad-manager/public/images/` theo hướng dẫn trong `thinkpad-manager/README-images.txt`. Chưa có ảnh thì web hiện khung xám.
