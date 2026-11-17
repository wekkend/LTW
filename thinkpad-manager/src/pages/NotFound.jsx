import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="empty">
      <h1>404</h1>
      <p>Không tìm thấy trang bạn yêu cầu.</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  )
}
