import { Link } from 'react-router'
import Thumb from './Thumb.jsx'

export default function SeriesCard({ series }) {
  return (
    <Link to={`/laptops/${series.id}`} className="series-card">
      <Thumb src={`/images/series/${series.id}.jpg`} alt={series.code} />
      <h3>{series.name}</h3>
      <p>{series.desc}</p>
    </Link>
  )
}
