import { Link } from 'react-router'
import StatCard from '../components/StatCard.jsx'
import SeriesCard from '../components/SeriesCard.jsx'
import LaptopCard from '../components/LaptopCard.jsx'
import Loading from '../components/Loading.jsx'
import useApi from '../hooks/useApi.js'
import { laptopApi, seriesApi, statsApi } from '../api/laptopApi.js'

export default function Home() {
  // 3 request GET đến backend: thống kê, dòng máy, máy mới nhất
  const stats = useApi(() => statsApi.get(), [])
  const series = useApi(() => seriesApi.getAll(), [])
  const laptops = useApi(() => laptopApi.getAll({ sort: 'newest' }), [])

  const newest = laptops.data ? laptops.data.slice(0, 4) : []

  return (
    <>
      <section className="hero">
        <h1>Quản lý kho Laptop ThinkPad</h1>
        <p>Theo dõi cấu hình, tình trạng và việc cho mượn từng dòng máy một cách dễ dàng.</p>
        <Link to="/laptops" className="btn">Xem danh sách laptop</Link>
      </section>

      <Loading loading={stats.loading} error={stats.error} />
      {stats.data && (
        <section className="stats">
          <StatCard label="Tổng số laptop" value={stats.data.total} />
          <StatCard label="Trong kho" value={stats.data.available} />
          <StatCard label="Đang cho mượn" value={stats.data.borrowed} />
          <StatCard label="Đang sửa chữa" value={stats.data.repairing} />
        </section>
      )}

      <section>
        <h2 className="section-title">Các dòng ThinkPad</h2>
        <Loading loading={series.loading} error={series.error} />
        <div className="series-grid">
          {series.data?.map((s) => <SeriesCard key={s.id} series={s} />)}
        </div>
      </section>

      <section>
        <h2 className="section-title">Máy mới nhất</h2>
        <Loading loading={laptops.loading} error={laptops.error} />
        <div className="laptop-grid">
          {newest.map((l) => <LaptopCard key={l.id} laptop={l} />)}
        </div>
      </section>
    </>
  )
}
