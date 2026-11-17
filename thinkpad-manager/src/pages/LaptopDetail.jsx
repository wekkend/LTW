import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Thumb from '../components/Thumb.jsx'
import Loading from '../components/Loading.jsx'
import useApi from '../hooks/useApi.js'
import { laptopApi } from '../api/laptopApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import { statusLabel, formatPrice } from '../data/laptops.js'

export default function LaptopDetail() {
  const { id } = useParams() // /laptop/3 -> id = "3" (luôn là chuỗi)
  const navigate = useNavigate()
  const [reloadKey, setReloadKey] = useState(0)
  const [actionError, setActionError] = useState('')

  const { data: laptop, loading, error } = useApi(() => laptopApi.getById(id), [id, reloadKey])

  // PUT: đổi trạng thái bằng cách gửi lại toàn bộ thông tin máy với status mới
  async function changeStatus(status) {
    setActionError('')
    try {
      await laptopApi.update(laptop.id, { ...laptop, status })
      setReloadKey((k) => k + 1)
    } catch (e) {
      setActionError(getErrorMessage(e))
    }
  }

  // DELETE: xóa laptop rồi quay về danh sách
  async function handleDelete() {
    if (!window.confirm(`Xóa "${laptop.name}"?`)) return
    try {
      await laptopApi.remove(laptop.id)
      navigate('/laptops')
    } catch (e) {
      setActionError(getErrorMessage(e))
    }
  }

  if (loading || error) {
    return (
      <>
        <Loading loading={loading} error={error} />
        {error && <p><Link to="/laptops">Quay lại danh sách</Link></p>}
      </>
    )
  }

  return (
    <>
      <p><Link to="/laptops">← Danh sách laptop</Link></p>
      <div className="detail">
        <Thumb src={`/images/laptops/${laptop.image}`} alt={laptop.name} />
        <div>
          <h1>{laptop.name}</h1>
          <p className="price big">{formatPrice(laptop.price)}</p>
          <span className={`badge badge-${laptop.status}`}>{statusLabel[laptop.status]}</span>

          <table className="spec-table">
            <tbody>
              <tr><th>Dòng máy</th><td><Link to={`/laptops/${laptop.seriesId}`}>{laptop.seriesId.toUpperCase()}</Link></td></tr>
              <tr><th>Năm</th><td>{laptop.year}</td></tr>
              <tr><th>CPU</th><td>{laptop.cpu}</td></tr>
              <tr><th>RAM</th><td>{laptop.ram}GB</td></tr>
              <tr><th>Ổ cứng</th><td>{laptop.storage}</td></tr>
              <tr><th>Màn hình</th><td>{laptop.screen}</td></tr>
            </tbody>
          </table>

          <div className="actions">
            <span>Đổi trạng thái:</span>
            {Object.entries(statusLabel).map(([key, label]) => (
              <button key={key} type="button" className="btn-small" disabled={laptop.status === key}
                onClick={() => changeStatus(key)}>{label}</button>
            ))}
          </div>
          <div className="actions">
            <Link to={`/admin/laptops/${laptop.id}/edit`} className="btn-small">Sửa thông tin</Link>
            <button type="button" className="btn-small danger" onClick={handleDelete}>Xóa</button>
          </div>
          {actionError && <p className="error">{actionError}</p>}
        </div>
      </div>
    </>
  )
}
