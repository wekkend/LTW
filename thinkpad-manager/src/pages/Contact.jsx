import { useState } from 'react'
import { contactApi } from '../api/laptopApi.js'
import { getErrorMessage } from '../api/axiosClient.js'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // POST /api/contact: gửi form lên backend, backend lưu vào bảng ContactMessages
  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await contactApi.send(form)
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <h1>Liên hệ</h1>
      {sent ? (
        <p className="success">Đã nhận thông tin của bạn. Cảm ơn bạn!</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Họ tên</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

          <label htmlFor="message">Nội dung</label>
          <textarea id="message" name="message" rows="4" required value={form.message} onChange={handleChange} />

          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={sending}>{sending ? 'Đang gửi...' : 'Gửi'}</button>
        </form>
      )}
    </>
  )
}
