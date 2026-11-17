import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'

export default function Header() {
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const navigate = useNavigate()

  // Giữ ô tìm kiếm khớp với ?q= trên URL (khi bấm back, reload...)
  useEffect(() => {
    setKeyword(searchParams.get('q') ?? '')
  }, [searchParams])

  function handleSearch(e) {
    e.preventDefault() // chặn trình duyệt tải lại trang
    navigate(`/laptops?q=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <header className="header">
      <div className="container header-top">
        <Link to="/" className="logo">LapManager</Link>

        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm laptop, ví dụ: X1 Carbon"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Tìm</button>
        </form>

        <div className="hotline">Hotline: <strong>0900 000 000</strong></div>
      </div>

      <nav className="nav">
        <div className="container">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/laptops">Laptop</NavLink>
          <NavLink to="/about-us">Giới thiệu</NavLink>
          <NavLink to="/contact">Liên hệ</NavLink>
          <NavLink to="/admin/laptops">Quản lý</NavLink>
        </div>
      </nav>
    </header>
  )
}
