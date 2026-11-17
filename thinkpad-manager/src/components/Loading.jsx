// Hiện "Đang tải..." hoặc thông báo lỗi; trả null nếu không có gì để hiện.
export default function Loading({ loading, error }) {
  if (loading) return <p className="empty">Đang tải dữ liệu...</p>
  if (error) return <p className="error">{error}</p>
  return null
}
