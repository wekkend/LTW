import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Loading from '../../components/Loading.jsx'
import useApi from '../../hooks/useApi.js'
import { laptopApi, seriesApi } from '../../api/laptopApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import { statusLabel } from '../../data/laptops.js'

const emptyForm = {
  name: '', seriesId: '', year: new Date().getFullYear(), cpu: '', ram: 16,
  storage: '', screen: '', price: 0, status: 'available', image: '',
}

// Dùng chung cho 2 trang:
//   /admin/laptops/new        -> POST (thêm mới)
//   /admin/laptops/:id/edit   -> GET để điền sẵn form, rồi PUT (cập nhật)
export default function LaptopForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const seriesRes = useApi(() => seriesApi.getAll(), [])
  const laptopRes = useApi(() => (isEdit ? laptopApi.getById(id) : Promise.resolve(null)), [id])

  // Khi tải xong laptop cần sửa thì đổ dữ liệu vào form
  useEffect(() => {
    if (laptopRes.data) setForm(laptopRes.data)
  }, [laptopRes.data])

  function handleChange(e) {
    const { name, value, type } = e.target
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const saved = isEdit ? await laptopApi.update(id, form) : await laptopApi.create(form)
      navigate(`/laptop/${saved.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
      setSaving(false)
    }
  }

  if (laptopRes.loading || laptopRes.error) {
    return <Loading loading={laptopRes.loading} error={laptopRes.error} />
  }

  return (
    <>
      <p><Link to="/admin/laptops">← Quản lý laptop</Link></p>
      <h1>{isEdit ? 'Sửa laptop' : 'Thêm laptop mới'}</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Tên máy</label>
        <input id="name" name="name" required minLength={2} value={form.name} onChange={handleChange} />

        <label htmlFor="seriesId">Dòng máy</label>
        <select id="seriesId" name="seriesId" required value={form.seriesId} onChange={handleChange}>
          <option value="">-- Chọn dòng máy --</option>
          {seriesRes.data?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label htmlFor="year">Năm</label>
        <input id="year" name="year" type="number" min="2000" max="2100" required value={form.year} onChange={handleChange} />

        <label htmlFor="cpu">CPU</label>
        <input id="cpu" name="cpu" required value={form.cpu} onChange={handleChange} />

        <label htmlFor="ram">RAM (GB)</label>
        <input id="ram" name="ram" type="number" min="1" required value={form.ram} onChange={handleChange} />

        <label htmlFor="storage">Ổ cứng</label>
        <input id="storage" name="storage" required value={form.storage} onChange={handleChange} />

        <label htmlFor="screen">Màn hình</label>
        <input id="screen" name="screen" required value={form.screen} onChange={handleChange} />

        <label htmlFor="price">Giá (₫)</label>
        <input id="price" name="price" type="number" min="0" required value={form.price} onChange={handleChange} />

        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          {Object.entries(statusLabel).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>

        <label htmlFor="image">Tên file ảnh (trong public/images/laptops)</label>
        <input id="image" name="image" value={form.image} onChange={handleChange} />

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </>
  )
}
