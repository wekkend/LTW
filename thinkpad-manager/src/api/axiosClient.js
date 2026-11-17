import axios from 'axios'

// Một "client" Axios dùng chung: mọi request tự có sẵn địa chỉ backend.
// Địa chỉ lấy từ file .env (VITE_API_URL), ví dụ http://localhost:5159/api
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5159/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Chuyển lỗi của Axios thành 1 câu tiếng Việt để hiện cho người dùng.
export function getErrorMessage(error) {
  if (!error.response) return 'Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.'
  const data = error.response.data
  if (data?.errors) return Object.values(data.errors).flat().join(' ') // lỗi validate (400)
  if (data?.message) return data.message                                // lỗi do controller trả về
  return `Có lỗi xảy ra (mã ${error.response.status}).`
}

export default axiosClient
