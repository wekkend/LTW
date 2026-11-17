import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import FilterSidebar from '../components/FilterSidebar.jsx'
import LaptopCard from '../components/LaptopCard.jsx'
import Loading from '../components/Loading.jsx'
import NotFound from './NotFound.jsx'
import useApi from '../hooks/useApi.js'
import { laptopApi, seriesApi } from '../api/laptopApi.js'

// Thêm giá trị vào danh sách nếu chưa có, bỏ ra nếu đã có (dùng cho checkbox)
function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function LaptopList() {
  const { seriesId } = useParams()                 // /laptops/x1 -> seriesId = "x1"
  const [searchParams] = useSearchParams()         // /laptops?q=carbon -> q = "carbon"
  const keyword = (searchParams.get('q') || '').trim()

  const [selectedYears, setSelectedYears] = useState([])
  const [selectedCpus, setSelectedCpus] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  const seriesRes = useApi(() => seriesApi.getAll(), [])
  // Lấy toàn bộ máy 1 lần để biết có những năm/CPU nào cho bộ lọc
  const allRes = useApi(() => laptopApi.getAll(), [])

  // Lọc/sắp xếp do BACKEND làm: mỗi lần điều kiện đổi lại gọi GET /api/laptops?...
  const listRes = useApi(
    () => laptopApi.getAll({ seriesId, q: keyword, years: selectedYears, cpus: selectedCpus, sort: sortBy }),
    [seriesId, keyword, selectedYears, selectedCpus, sortBy],
  )

  const seriesList = seriesRes.data ?? []
  const series = seriesList.find((s) => s.id === seriesId)

  // URL có dòng máy không tồn tại (vd /laptops/abc) -> trang 404
  if (seriesId && seriesRes.data && !series) return <NotFound />

  const all = allRes.data ?? []
  const years = [...new Set(all.map((l) => l.year))].sort()
  const cpus = [...new Set(all.map((l) => l.cpu))].sort()
  const result = listRes.data ?? []

  function reset() {
    setSelectedYears([])
    setSelectedCpus([])
    setSortBy('newest')
  }

  return (
    <>
      <h1>{series ? series.name : 'Tất cả laptop'}</h1>
      {series && <p className="muted">{series.desc}</p>}

      <div className="series-tabs">
        <Link to="/laptops" className={!seriesId ? 'active' : ''}>Tất cả</Link>
        {seriesList.map((s) => (
          <Link key={s.id} to={`/laptops/${s.id}`} className={seriesId === s.id ? 'active' : ''}>
            {s.code}
          </Link>
        ))}
      </div>

      <div className="list-layout">
        <FilterSidebar
          years={years}
          cpus={cpus}
          selectedYears={selectedYears}
          selectedCpus={selectedCpus}
          onToggleYear={(y) => setSelectedYears(toggle(selectedYears, y))}
          onToggleCpu={(c) => setSelectedCpus(toggle(selectedCpus, c))}
          onReset={reset}
        />

        <div>
          <div className="toolbar">
            <span>{result.length} sản phẩm{keyword && <> cho từ khóa "<strong>{keyword}</strong>"</>}</span>
            <label>
              Sắp xếp theo{' '}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </label>
          </div>

          <Loading loading={listRes.loading} error={listRes.error} />
          {!listRes.loading && !listRes.error && result.length === 0 && (
            <p className="empty">Không tìm thấy laptop phù hợp.</p>
          )}
          <div className="laptop-grid">
            {result.map((l) => <LaptopCard key={l.id} laptop={l} />)}
          </div>
        </div>
      </div>
    </>
  )
}
