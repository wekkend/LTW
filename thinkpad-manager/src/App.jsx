import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import LaptopList from './pages/LaptopList.jsx'
import LaptopDetail from './pages/LaptopDetail.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLaptops from './pages/admin/AdminLaptops.jsx'
import LaptopForm from './pages/admin/LaptopForm.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="laptops" element={<LaptopList />} />
        <Route path="laptops/:seriesId" element={<LaptopList />} />
        <Route path="laptop/:id" element={<LaptopDetail />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin/laptops" element={<AdminLaptops />} />
        <Route path="admin/laptops/new" element={<LaptopForm />} />
        <Route path="admin/laptops/:id/edit" element={<LaptopForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
