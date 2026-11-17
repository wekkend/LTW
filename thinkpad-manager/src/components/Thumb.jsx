import { useState } from 'react'

// Hiện ảnh; nếu chưa có file ảnh thì hiện khung xám có tên thay thế.
export default function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className="thumb thumb-fallback">{alt}</div>
  }
  return <img className="thumb" src={src} alt={alt} onError={() => setFailed(true)} />
}
