// Dữ liệu laptop giờ nằm trong SQL Server và lấy qua API (xem src/api/laptopApi.js).
// File này chỉ còn các hằng số/hàm hỗ trợ hiển thị.

export const statusLabel = {
  available: 'Trong kho',
  borrowed: 'Đang cho mượn',
  repairing: 'Đang sửa chữa',
}

// Định dạng số tiền kiểu Việt Nam: 29900000 -> "29.900.000 ₫"
export function formatPrice(n) {
  return n.toLocaleString('vi-VN') + ' ₫'
}
