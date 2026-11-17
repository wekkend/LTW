import { Link } from 'react-router'
import Thumb from './Thumb.jsx'
import { statusLabel, formatPrice } from '../data/laptops.js'

export default function LaptopCard({ laptop }) {
  return (
    <Link to={`/laptop/${laptop.id}`} className="laptop-card">
      <Thumb src={`/images/laptops/${laptop.image}`} alt={laptop.name} />
      <h3>{laptop.name}</h3>
      <p className="spec">{laptop.cpu} · {laptop.ram}GB · {laptop.storage}</p>
      <p className="price">{formatPrice(laptop.price)}</p>
      <span className={`badge badge-${laptop.status}`}>{statusLabel[laptop.status]}</span>
    </Link>
  )
}
