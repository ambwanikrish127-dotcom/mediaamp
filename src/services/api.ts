import axios from 'axios';

// Ensure a persistent session token for seat holds
export function getSessionToken(): string {
  let token = localStorage.getItem('cinebook_session_token');
  if (!token) {
    token = 'ses_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('cinebook_session_token', token);
  }
  return token;
}

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinebook_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cities API
export const CityService = {
  getCities: (search?: string) =>
    api.get('/cities', { params: search ? { search } : undefined }).then(res => res.data),

  getCityBySlug: (slug: string) =>
    api.get(`/cities/${slug}`).then(res => res.data)
};

// Movies API
export const MovieService = {
  getMovies: (params?: { genre?: string; language?: string; status?: string; search?: string }) =>
    api.get('/movies', { params }).then(res => res.data),

  getMovieById: (id: string) =>
    api.get(`/movies/${id}`).then(res => res.data),

  createMovie: (movieData: any) =>
    api.post('/movies', movieData).then(res => res.data),

  updateMovie: (id: string, movieData: any) =>
    api.put(`/movies/${id}`, movieData).then(res => res.data),

  deleteMovie: (id: string) =>
    api.delete(`/movies/${id}`).then(res => res.data)
};

// Theatres API
export const TheatreService = {
  getTheatres: (params?: { city?: string; search?: string }) =>
    api.get('/theatres', { params }).then(res => res.data),

  getTheatreById: (id: string) =>
    api.get(`/theatres/${id}`).then(res => res.data),

  createTheatre: (data: any) =>
    api.post('/theatres', data).then(res => res.data)
};

// Shows API
export const ShowService = {
  getShows: (params?: { movieId?: string; date?: string; theatreId?: string; city?: string }) =>
    api.get('/shows', { params }).then(res => res.data),

  getShowById: (id: string) =>
    api.get(`/shows/${id}`).then(res => res.data),

  createShow: (data: any) =>
    api.post('/shows', data).then(res => res.data),

  getSeats: (showId: string) =>
    api.get(`/shows/${showId}/seats`, {
      params: { sessionToken: getSessionToken() }
    }).then(res => res.data),

  lockSeats: (showId: string, seats: string[]) =>
    api.post(`/shows/${showId}/lock-seats`, {
      seats,
      sessionToken: getSessionToken()
    }).then(res => res.data),

  unlockSeats: (showId: string) =>
    api.post(`/shows/${showId}/unlock-seats`, {
      sessionToken: getSessionToken()
    }).then(res => res.data)
};

// Food / Concessions API
export const FoodService = {
  getFoodItems: () =>
    api.get('/food').then(res => res.data)
};

// Bookings API
export const BookingService = {
  createBooking: (payload: {
    showId: string;
    seatNumbers: string[];
    snacks: { foodItemId: string; quantity: number }[];
  }) =>
    api.post('/bookings', {
      ...payload,
      sessionToken: getSessionToken()
    }).then(res => res.data),

  getMyBookings: () =>
    api.get('/bookings/my').then(res => res.data),

  getBookingById: (id: string) =>
    api.get(`/bookings/${id}`).then(res => res.data),

  cancelBooking: (id: string) =>
    api.post(`/bookings/${id}/cancel`).then(res => res.data)
};

// Payment Gateway (Razorpay Sandbox/Test Mode)
export const PaymentService = {
  getConfig: () =>
    api.get('/payments/config').then(res => res.data),

  createOrder: (payload: {
    showId: string;
    seatNumbers: string[];
    snacks?: { foodItemId: string; quantity: number }[];
  }) =>
    api.post('/payments/create-order', {
      ...payload,
      sessionToken: getSessionToken()
    }).then(res => res.data),

  verifyPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    showId: string;
    seatNumbers: string[];
    snacks?: { foodItemId: string; quantity: number }[];
  }) =>
    api.post('/payments/verify', {
      ...payload,
      sessionToken: getSessionToken()
    }).then(res => res.data),

  handleFailure: (payload: { showId: string; orderId?: string; reason?: string }) =>
    api.post('/payments/failure', {
      ...payload,
      sessionToken: getSessionToken()
    }).then(res => res.data)
};

// Admin API
export const AdminService = {
  getStats: () =>
    api.get('/admin/stats').then(res => res.data),

  getAllBookings: () =>
    api.get('/admin/bookings').then(res => res.data)
};
