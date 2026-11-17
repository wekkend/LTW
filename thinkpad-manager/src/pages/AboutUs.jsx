import Loading from '../components/Loading.jsx'
import useApi from '../hooks/useApi.js'
import { seriesApi } from '../api/laptopApi.js'

export default function AboutUs() {
  const { data: seriesList, loading, error } = useApi(() => seriesApi.getAll(), [])

  return (
    <>
      <h1>Giới thiệu</h1>
      <p>
        LapManager là website quản lý laptop ThinkPad, thực hiện trong môn Lập trình Web.
        Hệ thống giúp xem danh sách máy, lọc theo cấu hình và theo dõi tình trạng từng máy.
      </p>

      <h2>Chức năng theo từng dòng máy</h2>
      <Loading loading={loading} error={error} />
      {seriesList && (
        <table className="spec-table wide">
          <thead>
            <tr><th>Mã dòng</th><th>Tên</th><th>Công dụng</th></tr>
          </thead>
          <tbody>
            {seriesList.map((s) => (
              <tr key={s.id}><td>{s.code}</td><td>{s.name}</td><td>{s.desc}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
