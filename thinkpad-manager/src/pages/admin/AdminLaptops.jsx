import { useState } from 'react'
import { Link } from 'react-router'
import Loading from '../../components/Loading.jsx'
import useApi from '../../hooks/useApi.js'
import { laptopApi } from '../../api/laptopApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import { statusLabel, formatPrice } from '../../data/laptops.js'

// Trang quản lý: bảng laptop + thêm / sửa / xóa.
export default function AdminLaptops() {
  const [reloadKey, setReloadKey] = useState(0)
  const [actionError, setActionError] = useState('')
  const { data: laptops, loading, error } = useApi(() => laptopApi.getAll({ sort: 'newest' }), [reloadKey])

  // DELETE /api/laptops/{id}
  async function handleDelete(l) {
    if (!window.confirm(`Xóa "${l.name}"?`)) return
    setActionError('')
    try {
      await laptopApi.remove(l.id)
      setReloadKey((k) => k + 1) // tải lại danh sách
    } catch (e) {
      setActionError(getErrorMessage(e))
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Quản lý laptop</h1>
        <Link to="/admin/laptops/new" className="btn">+ Thêm laptop</Link>
      </div>

      <Loading loading={loading} error={error} />
      {actionError && <p className="error">{actionError}</p>}

      {laptops && (
        <table className="spec-table wide admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Tên</th><th>Dòng</th><th>Năm</th><th>CPU</th>
              <th>Giá</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {laptops.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td><Link to={`/laptop/${l.id}`}>{l.name}</Link></td>
                <td>{l.seriesId}</td>
                <td>{l.year}</td>
                <td>{l.cpu}</td>
                <td>{formatPrice(l.price)}</td>
                <td><span className={`badge badge-${l.status}`}>{statusLabel[l.status]}</span></td>
                <td className="row-actions">
                  <Link to={`/admin/laptops/${l.id}/edit`} className="btn-small">Sửa</Link>
                  <button type="button" className="btn-small danger" onClick={() => handleDelete(l)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
