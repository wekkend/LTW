# LapManager – Giải thích cấu trúc & chấm điểm đồ án

> Đề tài: **Quản lý Laptop ThinkPad** (môn Lập trình Web).
> Công nghệ: React 19 + Vite 8 + react-router 8 (JavaScript, CSS thuần, dữ liệu mẫu trong file JS).
> File này chỉ là tài liệu đánh giá, không ảnh hưởng đến code.

---

## 1. Đây có phải là frontend không?

**Có. Đây là 100% frontend (client-side).**

- Chạy hoàn toàn trên trình duyệt; Vite chỉ là dev server/bundler, không phải backend.
- Không có API, không có database, không có đăng nhập thật. Dữ liệu laptop nằm cứng trong `src/data/laptops.js` và `src/data/series.js`.
- Điều này **đúng với phạm vi đề bài** (7 bước chỉ yêu cầu React + HTML/CSS + GitHub + react-router). Backend chưa phải yêu cầu ở giai đoạn này.

---

## 2. Cấu trúc thư mục

```
thinkpad-manager/
├── index.html              # Trang HTML gốc, chứa <div id="root"> và nạp src/main.jsx
├── package.json            # Dependencies: react, react-dom, react-router; dev: vite, oxlint
├── vite.config.js          # Plugin React, dev server port 3000 (khớp đề bài localhost:3000)
├── .oxlintrc.json          # Cấu hình linter
├── .gitignore              # Bỏ qua node_modules, dist...
├── README-images.txt       # Hướng dẫn thư mục/tên ảnh cần tự tải
├── public/                 # File tĩnh (favicon.svg, icons.svg). Ảnh sản phẩm sẽ đặt ở public/images/
└── src/
    ├── main.jsx            # Điểm vào: bọc <App/> trong <BrowserRouter> + nạp index.css
    ├── App.jsx             # BẢNG ROUTE của toàn site
    ├── index.css           # Toàn bộ CSS (~100 dòng): header, nav, grid, card, badge, form...
    ├── data/
    │   ├── laptops.js      # 12 laptop mẫu + statusLabel + formatPrice()
    │   └── series.js       # 7 dòng máy (ThinkBook, E/L, X1, T, P, X, Z) + getSeries()
    ├── components/         # Thành phần tái sử dụng
    │   ├── Layout.jsx      # Khung chung: Header + <Outlet/> + Footer
    │   ├── Header.jsx      # Logo, ô tìm kiếm, hotline, menu NavLink
    │   ├── Footer.jsx      # Chân trang
    │   ├── LaptopCard.jsx  # Thẻ laptop (link sang trang chi tiết)
    │   ├── SeriesCard.jsx  # Thẻ dòng máy (link sang /laptops/:seriesId)
    │   ├── StatCard.jsx    # Ô thống kê (tổng, trong kho, cho mượn, sửa chữa)
    │   ├── FilterSidebar.jsx # Bộ lọc năm + CPU (checkbox)
    │   └── Thumb.jsx       # Ảnh có fallback khung xám nếu thiếu file ảnh
    └── pages/              # Mỗi file = 1 trang
        ├── Home.jsx        # Trang chủ
        ├── LaptopList.jsx  # Danh sách + lọc + sắp xếp + tìm kiếm
        ├── LaptopDetail.jsx# Chi tiết 1 laptop
        ├── AboutUs.jsx     # Giới thiệu
        ├── Contact.jsx     # Form liên hệ
        └── NotFound.jsx    # 404
```

---

## 3. Luồng hoạt động / logic trang web

### 3.1 Khởi động
`index.html` → `main.jsx` (tạo `BrowserRouter`) → `App.jsx` (khai báo route) → `Layout` (Header/Footer cố định) → `<Outlet/>` hiển thị page tương ứng URL.

### 3.2 Bảng route (`src/App.jsx`)

| URL | Trang | Ghi chú |
|---|---|---|
| `/` | Home | route `index` |
| `/laptops` | LaptopList | tất cả laptop; hỗ trợ `?q=từ khóa` |
| `/laptops/:seriesId` | LaptopList | lọc theo dòng máy, vd `/laptops/x1` |
| `/laptop/:id` | LaptopDetail | vd `/laptop/3` |
| `/about-us` | AboutUs | đúng ví dụ trong đề |
| `/contact` | Contact | |
| `*` | NotFound | trang 404 |

Dùng **nested route** (Layout làm route cha) → Header/Footer không bị render lại code ở từng trang.

### 3.3 Logic từng trang
- **Home**: tính thống kê (tổng/trong kho/cho mượn/đang sửa) bằng `filter`; lấy 4 máy mới nhất bằng `sort` theo năm; hiển thị hero, thống kê, các dòng máy, máy mới.
- **LaptopList**: đọc `seriesId` (`useParams`) và `q` (`useSearchParams`); state `selectedYears`, `selectedCpus`, `sortBy` (`useState`); chuỗi `.filter()` theo dòng máy → năm → CPU → từ khóa, rồi `.sort()` theo mới nhất/giá tăng/giá giảm; có trạng thái "không tìm thấy". Danh sách năm/CPU sinh tự động từ dữ liệu bằng `Set`.
- **LaptopDetail**: `useParams` lấy `id`, `find` trong mảng; không thấy thì hiện thông báo + link quay lại; có link ngược về dòng máy.
- **Header**: tìm kiếm dùng `useNavigate` → `/laptops?q=...` (có `encodeURIComponent`); menu dùng `NavLink` nên tự có trạng thái active.
- **Contact**: form có `required`, submit bằng `preventDefault` rồi hiện lời cảm ơn (chỉ giả lập, chưa gửi đi đâu).
- **AboutUs**: render bảng dòng máy từ `seriesList`.

---

## 4. Chấm điểm theo từng yêu cầu của đề

| # | Yêu cầu | Kết quả | Bằng chứng / nhận xét |
|---|---|---|---|
| 1 | Tạo project ReactJS với Vite/Next.js | ✅ Đạt | `vite.config.js`, `package.json` (react 19 + vite). |
| 2 | Viết HTML (JSX) giao diện trang chủ theo đề tài | ✅ Đạt | `Home.jsx`: hero, thống kê, các dòng máy, máy mới nhất; đúng đề tài quản lý laptop. |
| 3 | Tạo file .css định dạng trang chủ | ✅ Đạt | `src/index.css`, được import trong `main.jsx`. |
| 4 | Tạo tài khoản GitHub, repo, push code | ⚠️ **Chưa đạt / chưa xác nhận được** | Thư mục có `.git` nhưng **chưa có commit nào** (`branch 'main' does not have any commits yet`) và **chưa cấu hình remote**. Chưa thể coi là đã push. |
| 5 | Tạo thêm pages/components khác | ✅ Đạt | 6 pages + 8 components, tách hợp lý. |
| 6 | Tìm hiểu & tích hợp react-router | ✅ Đạt | `BrowserRouter` ở `main.jsx`, `Routes/Route/Outlet/Link/NavLink/useParams/useSearchParams/useNavigate`. |
| 7 | Chuyển trang khi click menu hoặc gõ URL | ✅ Đạt (trên dev server) | Menu `NavLink` chuyển `/` → `/about-us`; gõ trực tiếp `localhost:3000/about-us` hiển thị đúng vì Vite dev server tự fallback về `index.html`. Port 3000 đã cấu hình. |

**Tổng kết: 6/7 yêu cầu đạt, riêng bước 4 (GitHub) cần hoàn tất.**

Điểm cộng ngoài yêu cầu: route động (`:seriesId`, `:id`), query string tìm kiếm, bộ lọc/sắp xếp, trang 404, component hóa tốt, comment tiếng Việt dễ hiểu, ảnh có fallback.

---

## 5. Lỗi nhỏ / điểm cần lưu ý trong logic

1. **Thiếu ảnh**: thư mục `public/images/series/` và `public/images/laptops/` chưa tồn tại → web hiện khung xám (không lỗi, nhưng nhìn chưa đẹp khi demo).
2. **`/laptops/abc` (dòng máy không tồn tại)**: `LaptopList` vẫn hiện tiêu đề "Tất cả laptop" nhưng danh sách rỗng, nên chưa báo rõ "dòng máy không tồn tại". Nên redirect/hiện 404.
3. **Ô tìm kiếm ở Header** không đồng bộ với `?q=` trên URL (tải lại trang hoặc bấm back thì ô nhập vẫn trống/cũ).
4. **Bộ lọc năm/CPU** chỉ nằm trong state, không lên URL → reload hoặc share link sẽ mất lọc.
5. **Nút "Xóa bộ lọc"** không xóa từ khóa `q` và không đổi `sortBy` về mặc định.
6. **Form Contact** chỉ hiển thị lời cảm ơn, dữ liệu không được lưu/gửi đi đâu.
7. **Header có "Hotline" và Footer** là nội dung giả (0900 000 000).
8. **Deploy production**: khi build (`vite build`) và đưa lên hosting tĩnh, gõ trực tiếp `/about-us` sẽ 404 nếu chưa cấu hình rewrite về `index.html` (Netlify `_redirects`, Vercel `vercel.json`...). Dev server thì không bị.

---

## 6. Còn thiếu gì để thành một website hoàn chỉnh?

### 6.1 Để đạt trọn điểm đề bài (ưu tiên cao, làm ngay)
- [ ] `git add . && git commit` lần đầu.
- [ ] Tạo repo trên GitHub, `git remote add origin ...`, `git push -u origin main`.
- [ ] Thêm ảnh vào `public/images/...` theo `README-images.txt` (hoặc ảnh tự chọn) để demo đẹp.
- [ ] Viết `README.md` (mô tả, cách chạy `npm install` / `npm run dev`, danh sách route, ảnh chụp màn hình).

### 6.2 Hoàn thiện frontend
- [ ] Hiển thị trang 404 khi `seriesId` sai.
- [ ] Đồng bộ ô tìm kiếm/bộ lọc/sắp xếp với URL (`useSearchParams`).
- [ ] Responsive cho điện thoại/tablet (kiểm tra media query trong `index.css`).
- [ ] Phân trang hoặc "xem thêm" khi nhiều laptop.
- [ ] Trạng thái loading / error khi sau này lấy dữ liệu từ API.
- [ ] Thêm `<title>` theo từng trang, SEO cơ bản, favicon riêng (hiện `index.html` dùng `data:,`).
- [ ] Accessibility: alt ảnh, focus, label đã khá ổn, kiểm tra thêm contrast.
- [ ] Deploy (Vercel/Netlify/GitHub Pages) kèm cấu hình rewrite SPA.

### 6.3 Phần "quản lý" thật sự (vì đề tài là *quản lý* laptop)
Hiện web mới chỉ **xem** (read-only). Một hệ thống quản lý hoàn chỉnh cần:
- [ ] **CRUD laptop**: thêm / sửa / xóa laptop (form + validate).
- [ ] **Đổi trạng thái** (Trong kho → Cho mượn → Sửa chữa) và **ghi lịch sử mượn/trả**, người mượn, ngày hẹn trả.
- [ ] **Đăng nhập / phân quyền** (admin vs người xem).
- [ ] **Giỏ/đăng ký mượn** hoặc trang quản trị (dashboard admin).
- [ ] Thống kê/biểu đồ thật theo dữ liệu.

### 6.4 Backend (phần chưa có)
- [ ] **API server** (Node.js + Express/NestJS, hoặc Spring/ASP.NET/Laravel...) cung cấp REST/GraphQL.
- [ ] **Cơ sở dữ liệu** (MySQL/PostgreSQL/MongoDB) thay cho `laptops.js`.
- [ ] **Xác thực** (JWT/session), mã hóa mật khẩu.
- [ ] **Upload ảnh** lên server/cloud thay vì đặt tay trong `public/`.
- [ ] **Gửi form liên hệ** thật (lưu DB hoặc gửi email).
- [ ] Phía frontend: gọi API bằng `fetch`/axios (+ React Query), quản lý state toàn cục (Context/Redux) nếu cần, biến môi trường `.env`.

### 6.5 Chất lượng & vận hành
- [ ] Kiểm thử (Vitest + React Testing Library, hoặc Playwright cho luồng chính).
- [ ] CI (GitHub Actions chạy `npm run lint` và `npm run build`).
- [ ] Mở rộng quy tắc lint, có thể chuyển sang TypeScript.

---

## 7. Kết luận

- Project là **frontend SPA** làm đúng và khá chỉn chu so với yêu cầu 7 bước: cấu trúc rõ ràng, routing đầy đủ (kể cả route động và 404), logic lọc/sắp xếp/tìm kiếm chạy đúng.
- **Điều duy nhất chưa thỏa đề**: bước 4 – chưa commit/push lên GitHub.
- Muốn thành website hoàn chỉnh theo đúng nghĩa *quản lý laptop*: cần thêm chức năng CRUD + mượn/trả + đăng nhập, và một **backend + database** thay cho dữ liệu mẫu cứng.
