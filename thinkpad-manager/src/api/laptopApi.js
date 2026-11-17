import axiosClient from './axiosClient.js'

// Mỗi hàm ứng với 1 endpoint của backend. Axios trả về response, dữ liệu nằm ở response.data.

export const laptopApi = {
  // GET /api/laptops?q=&seriesId=&years=&cpus=&sort=
  getAll: (params) =>
    axiosClient.get('/laptops', {
      params,
      // years=2024&years=2025 (ASP.NET cần dạng lặp tên, không phải years[]=...)
      paramsSerializer: { indexes: null },
    }).then((r) => r.data),

  // GET /api/laptops/3
  getById: (id) => axiosClient.get(`/laptops/${id}`).then((r) => r.data),

  // POST /api/laptops
  create: (laptop) => axiosClient.post('/laptops', laptop).then((r) => r.data),

  // PUT /api/laptops/3
  update: (id, laptop) => axiosClient.put(`/laptops/${id}`, laptop).then((r) => r.data),

  // DELETE /api/laptops/3
  remove: (id) => axiosClient.delete(`/laptops/${id}`),
}

export const seriesApi = {
  getAll: () => axiosClient.get('/series').then((r) => r.data),
}

export const statsApi = {
  get: () => axiosClient.get('/stats').then((r) => r.data),
}

export const contactApi = {
  // POST /api/contact
  send: (form) => axiosClient.post('/contact', form).then((r) => r.data),
}
