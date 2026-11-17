// Cột bộ lọc bên trái (giống trang tham khảo): lọc theo năm và CPU.
// Component này không tự giữ dữ liệu, mà nhận từ cha qua props.
export default function FilterSidebar({ years, cpus, selectedYears, selectedCpus, onToggleYear, onToggleCpu, onReset }) {
  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h4>Năm sản xuất</h4>
        {years.map((y) => (
          <label key={y}>
            <input type="checkbox" checked={selectedYears.includes(y)} onChange={() => onToggleYear(y)} />
            {y}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>CPU</h4>
        {cpus.map((c) => (
          <label key={c}>
            <input type="checkbox" checked={selectedCpus.includes(c)} onChange={() => onToggleCpu(c)} />
            {c}
          </label>
        ))}
      </div>

      <button type="button" className="btn-outline" onClick={onReset}>Xóa bộ lọc</button>
    </aside>
  )
}
