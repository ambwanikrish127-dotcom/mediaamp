export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface IMovie {
  _id: string;
  title: string;
  description: string;
  poster: string;
  banner: string;
  genre: string[];
  language: string;
  rating: number;
  duration: string;
  certification: string;
  releaseDate: string;
  director: string;
  cast: string[];
  status: 'NOW_SHOWING' | 'COMING_SOON';
  isActive?: boolean;
}

export interface ICity {
  _id: string;
  name: string;
  state: string;
  country: string;
  slug: string;
  isActive: boolean;
}

export interface ITheatre {
  _id: string;
  name: string;
  city: string;
  citySlug?: string;
  address?: string;
  location?: string;
  images?: string[];
  facilities?: string[];
  totalScreens: number;
  status?: 'ACTIVE' | 'INACTIVE';
  isActive?: boolean;
}

export interface IShow {
  _id: string;
  movieId: string;
  movieTitle?: string;
  moviePoster?: string;
  certification?: string;
  duration?: string;
  theatreId: string;
  theatreName?: string;
  theatreCity?: string;
  theatreAddress?: string;
  theatreLocation?: string;
  screenId: string;
  screenName?: string;
  screenType?: string;
  date: string;
  time: string;
  prices: {
    Regular: number;
    Premium: number;
    Recliner: number;
  };
  bookedSeats?: string[];
  lockedSeats?: any[];
}

export interface ISeatState {
  _id: string;
  seatNumber: string;
  row: string;
  number: number;
  category: 'Regular' | 'Premium' | 'Recliner';
  price: number;
  status: 'AVAILABLE' | 'SELECTED' | 'BOOKED';
  isLockedByMe?: boolean;
}

export interface IFoodItem {
  _id: string;
  name: string;
  category: 'Popcorn' | 'Beverages' | 'Combos' | 'Snacks';
  price: number;
  image: string;
  description: string;
  available: boolean;
}

export interface ISelectedSnack {
  foodItem: IFoodItem;
  quantity: number;
}

export interface IBookingSeat {
  seatNumber: string;
  category: 'Regular' | 'Premium' | 'Recliner';
  price: number;
}

export interface IBookingSnack {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IBooking {
  _id: string;
  bookingId: string;
  userId: string;
  userEmail: string;
  userName: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  theatreLocation: string;
  screenId: string;
  screenName: string;
  showId: string;
  showDate: string;
  showTime: string;
  seats: IBookingSeat[];
  snacks: IBookingSnack[];
  ticketAmount: number;
  snackAmount: number;
  convenienceFee: number;
  discount: number;
  totalAmount: number;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  cancellationReason?: string;
  refundId?: string;
  createdAt: string;
}

export interface IAdminStats {
  totalMovies: number;
  totalTheatres: number;
  totalShows: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  recentBookings: IBooking[];
}
