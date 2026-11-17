import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

// Khung chung của mọi trang. <Outlet /> là chỗ trang con hiện ra.
export default function Layout() {
  return (
    <>
      <Header />
      <main className="container main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
