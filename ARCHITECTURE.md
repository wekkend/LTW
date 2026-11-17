# LapManager – Kiến trúc & hướng dẫn (Bài 2: Backend + Database)

Đề tài: **Quản lý laptop ThinkPad**.
Công nghệ: **React + Vite + Axios** (frontend) · **ASP.NET Core Web API (.NET 10)** (backend) · **EF Core 10** · **SQL Server Express** (database).

---

## 1. Tổng quan: 3 tầng nối với nhau thế nào

```
┌─────────────────────┐   HTTP + JSON    ┌──────────────────────────┐    SQL     ┌───────────────────┐
│  FRONTEND (React)   │ ───────────────► │  BACKEND (ASP.NET Core)  │ ─────────► │  DATABASE         │
│  localhost:3000     │   Axios          │  localhost:5159          │  EF Core   │  SQL Server       │
│  Chạy trên trình    │ ◄─────────────── │  Chạy trên máy chủ       │ ◄───────── │  .\SQLEXPRESS     │
│  duyệt người dùng   │   JSON           │                          │            │  ThinkPadManagerDb│
└─────────────────────┘                  └──────────────────────────┘            └───────────────────┘
   Giao diện, bấm nút,                      Luật nghiệp vụ, validate,               Lưu trữ lâu dài
   hiển thị dữ liệu                         cổng duy nhất vào database              (tắt máy vẫn còn)
```

| Khái niệm | Là gì | Trong project này |
|---|---|---|
| **Frontend** | Phần người dùng nhìn thấy và thao tác, chạy trong trình duyệt. **Không được nối thẳng database** (lộ mật khẩu DB, ai cũng sửa được dữ liệu). | Thư mục `thinkpad-manager/` – React: trang chủ, danh sách, chi tiết, quản lý... |
| **Backend** | Chương trình chạy trên máy chủ, nhận request, kiểm tra hợp lệ, đọc/ghi database rồi trả kết quả. | Thư mục `backend/ThinkPadManager.Api/` – ASP.NET Core. |
| **API** | "Hợp đồng" giữa frontend và backend: danh sách địa chỉ (endpoint) + phương thức (GET/POST/PUT/DELETE) + dạng JSON. | `/api/laptops`, `/api/series`, `/api/stats`, `/api/contact`. |
| **Database** | Nơi lưu dữ liệu dạng bảng. | SQL Server: bảng `Laptops`, `Series`, `ContactMessages`. |
| **ORM / EF Core** | Thư viện cho phép viết C# thay vì SQL; tự dịch sang SQL. | `AppDbContext` + các class `Laptop`, `Series`... |
| **Migration** | "Lịch sử thay đổi cấu trúc DB" dưới dạng code C#. Chạy migration là DB được tạo/cập nhật đúng theo model. | Thư mục `Migrations/` (`InitialCreate`). |
| **Axios** | Thư viện JS gửi HTTP request từ frontend. | `src/api/axiosClient.js`, `src/api/laptopApi.js`. |
| **CORS** | Trình duyệt chặn trang ở `:3000` gọi sang `:5159` trừ khi backend cho phép. | `Program.cs` → `AddCors` cho phép `http://localhost:3000`. |
| **DTO** | Class mô tả dữ liệu nhận vào/trả ra, tách khỏi bảng DB. | `Dtos/Dtos.cs` (`LaptopInput`, `ContactInput`, `StatsDto`). |

> Vì sao cần backend ở giữa? Vì DB cần giữ bí mật mật khẩu, kiểm tra dữ liệu (validate), phân quyền... Những việc đó không thể tin tưởng giao cho trình duyệt.

---

## 2. Cấu trúc thư mục

```
thinkpad-manager/                         (thư mục gốc)
├── ARCHITECTURE.md                       
├── PROJECT-REVIEW.md                    
├── backend/
│   ├── .gitignore
│   └── ThinkPadManager.Api/              ===== BACKEND =====
│       ├── Program.cs                    Cấu hình: DB, JSON, CORS, Swagger, controllers
│       ├── appsettings.json              Chuỗi kết nối SQL Server + CORS origins
│       ├── Models/Entities.cs            Laptop, Series, ContactMessage, LaptopStatus (= bảng DB)
│       ├── Dtos/Dtos.cs                  LaptopInput, ContactInput, StatsDto (+ validate)
│       ├── Data/AppDbContext.cs          Cầu nối EF Core ↔ DB, quan hệ, SEED dữ liệu mẫu
│       ├── Controllers/
│       │   ├── LaptopsController.cs      GET / GET{id} / POST / PUT / DELETE
│       │   └── OtherControllers.cs       SeriesController, StatsController, ContactController
│       └── Migrations/                   Migration InitialCreate + snapshot
└── thinkpad-manager/                     ===== FRONTEND =====
    ├── .env                              VITE_API_URL=http://localhost:5159/api
    ├── vite.config.js                    Port 3000
    └── src/
        ├── main.jsx · App.jsx            Router + bảng route
        ├── api/
        │   ├── axiosClient.js            Axios dùng chung (baseURL, timeout, getErrorMessage)
        │   └── laptopApi.js              laptopApi / seriesApi / statsApi / contactApi
        ├── hooks/useApi.js               Hook gọi API: { data, loading, error }
        ├── components/                   Header, Footer, Layout, LaptopCard, Loading...
        ├── pages/                        Home, LaptopList, LaptopDetail, AboutUs, Contact, NotFound
        │   └── admin/                    AdminLaptops (bảng + xóa), LaptopForm (thêm/sửa)
        └── data/laptops.js               Chỉ còn statusLabel, formatPrice (dữ liệu đã chuyển vào DB)
```

---

## 3. Database (SQL Server)

- Server: `.\SQLEXPRESS` · Database: `ThinkPadManagerDb` · Xác thực Windows (`Trusted_Connection=True`).
- Chuỗi kết nối nằm ở `appsettings.json` → `ConnectionStrings:Default`.

```
Series (1) ───────────< (N) Laptops               ContactMessages
  Id (PK, chuỗi: "x1")        Id (PK, int, tự tăng)   Id (PK)
  Name, Code, Desc            Name, Year, Cpu, Ram    Name, Email, Message
                              Storage, Screen, Price  CreatedAt
                              Status (chuỗi)
                              Image
                              SeriesId (FK → Series.Id)
```

- 1 dòng máy có nhiều laptop; xóa dòng máy khi còn laptop bị chặn (`DeleteBehavior.Restrict`).
- `Status` lưu dạng chữ (`Available/Borrowed/Repairing`), JSON trả về `available/borrowed/repairing`.
- 7 dòng máy + 12 laptop mẫu được **seed** trong `AppDbContext.OnModelCreating` → có sẵn sau khi chạy migration.

---

## 4. Danh sách endpoint (API)

Base URL: `http://localhost:5159/api` (xem thử tại Swagger: `http://localhost:5159/swagger`).

| Method | URL | Việc | Mã trả về |
|---|---|---|---|
| **GET** | `/laptops?q=&seriesId=&years=&cpus=&sort=` | Danh sách, lọc, tìm, sắp xếp (`newest`/`price-asc`/`price-desc`) | 200 |
| **GET** | `/laptops/{id}` | Chi tiết 1 laptop | 200 / 404 |
| **POST** | `/laptops` | Thêm laptop (body JSON) | 201 / 400 |
| **PUT** | `/laptops/{id}` | Cập nhật laptop (kể cả đổi trạng thái) | 200 / 400 / 404 |
| **DELETE** | `/laptops/{id}` | Xóa laptop | 204 / 404 |
| GET | `/series` · `/series/{id}` | Dòng máy | 200 / 404 |
| GET | `/stats` | Thống kê trang chủ | 200 |
| POST | `/contact` | Lưu tin nhắn liên hệ | 201 / 400 |

Ví dụ body `POST /api/laptops`:
```json
{ "name": "ThinkPad T14 Gen 6", "seriesId": "t", "year": 2025, "cpu": "Core Ultra 7",
  "ram": 32, "storage": "1TB SSD", "screen": "14\" WUXGA", "price": 35000000,
  "status": "available", "image": "" }
```

Validate (DataAnnotations trong `LaptopInput`): tên 2–150 ký tự, năm 2000–2100, RAM ≥ 1, giá ≥ 0, `seriesId` phải tồn tại. Sai → trả **400** kèm danh sách lỗi.

---

## 5. Luồng hoạt động (ví dụ cụ thể)

### 5.1 Mở trang danh sách `/laptops?q=carbon`
```
1. Trình duyệt tải React (Vite :3000), react-router chọn LaptopList.
2. LaptopList gọi useApi → laptopApi.getAll({ q: "carbon", sort: "newest" })
3. Axios gửi:  GET http://localhost:5159/api/laptops?q=carbon&sort=newest
4. Backend: LaptopsController.GetAll → EF Core tạo SQL:
      SELECT ... FROM Laptops WHERE Name LIKE '%carbon%' ORDER BY Year DESC
5. SQL Server trả các dòng → EF Core biến thành object Laptop → ASP.NET đổi thành JSON.
6. Axios nhận JSON → useApi cập nhật state → React vẽ lại các LaptopCard.
```

### 5.2 Thêm laptop (POST) – `/admin/laptops/new`
```
Form (LaptopForm) → laptopApi.create(form) → POST /api/laptops (JSON)
   → Backend validate (400 nếu sai) → kiểm tra Series tồn tại
   → db.Laptops.Add + SaveChangesAsync  (INSERT INTO Laptops ...)
   → 201 Created + laptop mới (có Id do DB tự tăng) → frontend chuyển tới /laptop/{id}
```
Tương tự: **PUT** (`LaptopForm` chế độ sửa, nút đổi trạng thái ở trang chi tiết) → `UPDATE`; **DELETE** (nút Xóa) → `DELETE`, trả 204.

### 5.3 Vòng đời một request lỗi
Backend không chạy → Axios không có `response` → `getErrorMessage` hiện "Không kết nối được máy chủ". Backend trả 400/404 → hiện nội dung lỗi từ `errors`/`message`.

---


### Chạy dự án (2 terminal)

**Terminal 1 – backend**
```bash
cd backend/ThinkPadManager.Api
dotnet run --launch-profile http
```
→ API tại http://localhost:5159 , Swagger tại http://localhost:5159/swagger

**Terminal 2 – frontend**
```bash
cd thinkpad-manager
npm install
npm run dev
```
→ Web tại http://localhost:3000 (nhớ bật backend trước, nếu không trang sẽ báo lỗi kết nối).

### Dựng lại database từ đầu (máy khác)
```bash
cd backend/ThinkPadManager.Api
dotnet tool install --global dotnet-ef --version "10.*"
dotnet ef database update        # tạo DB ThinkPadManagerDb + 3 bảng + dữ liệu mẫu
```
Nếu SQL Server của máy đó khác tên (ví dụ `(localdb)\MSSQLLocalDB`) → sửa `ConnectionStrings:Default` trong `appsettings.json`.

---


## 9. Việc còn lại / lưu ý

- **GitHub**: repo `.git` hiện nằm trong thư mục `thinkpad-manager/thinkpad-manager` (chỉ frontend) và **chưa có commit**. Để nộp cả backend nên chuyển repo lên thư mục gốc (`git init` ở thư mục gốc, thêm `.gitignore` cho `node_modules`, `bin`, `obj`, `dist`) rồi commit + push.
- **Ảnh sản phẩm**: vẫn chưa có `public/images/...`, web hiện khung xám (không lỗi).
- **Chưa có đăng nhập/phân quyền**: ai cũng vào được `/admin/laptops`. Có thể làm ở bài sau (JWT).
- **Bộ lọc năm/CPU** vẫn là state trong trang (chưa đưa lên URL).
- Bảo mật khi đưa lên server thật: đổi CORS origin, dùng tài khoản SQL riêng, không commit mật khẩu vào `appsettings.json` (dùng User Secrets / biến môi trường).
- Cảnh báo lint nhẹ (3 warning về `setState` trong `useEffect`) – không ảnh hưởng chạy.

---

## 10. Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân / cách xử lý |
|---|---|
| Web hiện "Không kết nối được máy chủ" | Backend chưa chạy hoặc sai port → chạy `dotnet run --launch-profile http`, kiểm tra `.env`. |
| Console báo CORS | Origin frontend không nằm trong `Cors:Origins` (`appsettings.json`). |
| `dotnet ef` báo không tương thích net10.0 | Cài bản 10: `dotnet tool update -g dotnet-ef --version "10.*"`. |
| `Cannot open database` / login failed | SQL Server chưa chạy (`Get-Service MSSQL$SQLEXPRESS`) hoặc sai tên server trong connection string. |
| `SSL Provider ... certificate chain` | Giữ `TrustServerCertificate=True` trong connection string (môi trường dev). |
| Gõ thẳng `/about-us` bị 404 khi deploy | Cần rewrite mọi đường dẫn về `index.html` (dev server Vite đã tự làm). |
