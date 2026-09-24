import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export const UserSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Movie Schema
export interface IMovie extends Document {
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
  isActive: boolean;
  createdAt: Date;
}

export const MovieSchema = new Schema({
  _id: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  banner: { type: String, required: true },
  genre: [{ type: String }],
  language: { type: String, required: true },
  rating: { type: Number, default: 8.0 },
  duration: { type: String, required: true },
  certification: { type: String, default: 'UA' },
  releaseDate: { type: String, required: true },
  director: { type: String, required: true },
  cast: [{ type: String }],
  status: { type: String, enum: ['NOW_SHOWING', 'COMING_SOON'], default: 'NOW_SHOWING' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const MovieModel = mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);

// City Schema
export interface ICity extends Document {
  name: string;
  state: string;
  country: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
}

export const CitySchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, default: 'India' },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const CityModel = mongoose.models.City || mongoose.model<ICity>('City', CitySchema);

// Theatre Schema
export interface ITheatre extends Document {
  name: string;
  city: string; // Normalized city name e.g. "Jaipur"
  citySlug?: string;
  address: string;
  location: string; // Alias for address
  images: string[];
  facilities: string[];
  totalScreens: number;
  status: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  createdAt: Date;
}

export const TheatreSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  city: { type: String, required: true },
  citySlug: { type: String, lowercase: true, trim: true },
  address: { type: String, required: true },
  location: { type: String },
  images: [{ type: String }],
  facilities: [{ type: String }],
  totalScreens: { type: Number, default: 2 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const TheatreModel = mongoose.models.Theatre || mongoose.model<ITheatre>('Theatre', TheatreSchema);

// Screen Schema
export interface IScreen extends Document {
  theatreId: string;
  name: string;
  type: string; // 'IMAX' | 'Dolby Atmos' | '4DX' | 'Standard'
  totalSeats: number;
}

export const ScreenSchema = new Schema({
  _id: { type: String },
  theatreId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Dolby Atmos' },
  totalSeats: { type: Number, default: 60 }
});

export const ScreenModel = mongoose.models.Screen || mongoose.model<IScreen>('Screen', ScreenSchema);

// Seat Schema
export interface ISeat extends Document {
  screenId: string;
  seatNumber: string; // e.g. A1, B3
  row: string; // e.g. A
  number: number;
  category: 'Regular' | 'Premium' | 'Recliner';
}

export const SeatSchema = new Schema({
  _id: { type: String },
  screenId: { type: String, required: true },
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  number: { type: Number, required: true },
  category: { type: String, enum: ['Regular', 'Premium', 'Recliner'], default: 'Regular' }
});

export const SeatModel = mongoose.models.Seat || mongoose.model<ISeat>('Seat', SeatSchema);

// Show Schema
export interface ILockedSeat {
  seatNumber: string;
  lockedBy: string; // userId or sessionToken
  lockedUntil: Date;
}

export interface IShow extends Document {
  movieId: string;
  theatreId: string;
  screenId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 10:30 AM
  prices: {
    Regular: number;
    Premium: number;
    Recliner: number;
  };
  bookedSeats: string[];
  lockedSeats: ILockedSeat[];
  isActive: boolean;
  createdAt: Date;
}

export const ShowSchema = new Schema({
  _id: { type: String },
  movieId: { type: String, required: true },
  theatreId: { type: String, required: true },
  screenId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  prices: {
    Regular: { type: Number, default: 200 },
    Premium: { type: Number, default: 320 },
    Recliner: { type: Number, default: 500 }
  },
  bookedSeats: [{ type: String }],
  lockedSeats: [{
    seatNumber: { type: String },
    lockedBy: { type: String },
    lockedUntil: { type: Date }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const ShowModel = mongoose.models.Show || mongoose.model<IShow>('Show', ShowSchema);

// FoodItem Schema
export interface IFoodItem extends Document {
  name: string;
  category: 'Popcorn' | 'Beverages' | 'Combos' | 'Snacks';
  price: number;
  image: string;
  description: string;
  available: boolean;
}

export const FoodItemSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  category: { type: String, enum: ['Popcorn', 'Beverages', 'Combos', 'Snacks'], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  available: { type: Boolean, default: true }
});

export const FoodItemModel = mongoose.models.FoodItem || mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);

// Booking Schema
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

export interface IBooking extends Document {
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
  createdAt: Date;
}

export const BookingSchema = new Schema({
  _id: { type: String },
  bookingId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  theatreId: { type: String, required: true },
  theatreName: { type: String, required: true },
  theatreLocation: { type: String, required: true },
  screenId: { type: String, required: true },
  screenName: { type: String, required: true },
  showId: { type: String, required: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: [{
    seatNumber: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  snacks: [{
    foodItemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  ticketAmount: { type: Number, required: true },
  snackAmount: { type: Number, default: 0 },
  convenienceFee: { type: Number, default: 40 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  cancellationReason: { type: String },
  refundId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

// Payment Schema
export interface IPayment extends Document {
  paymentId: string;
  bookingId: string;
  userId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  signatureVerified: boolean;
  transactionId?: string;
  method?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const PaymentSchema = new Schema({
  _id: { type: String },
  paymentId: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  userId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'CREATED' },
  signatureVerified: { type: Boolean, default: false },
  transactionId: { type: String },
  method: { type: String, default: 'Razorpay Test Mode' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

// Refund Schema
export interface IRefund extends Document {
  refundId: string;
  bookingId: string;
  amount: number;
  status: 'INITIATED' | 'COMPLETED';
  reason: string;
  createdAt: Date;
}

export const RefundSchema = new Schema({
  _id: { type: String },
  refundId: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['INITIATED', 'COMPLETED'], default: 'INITIATED' },
  reason: { type: String, default: 'User requested cancellation before 30 min cutoff' },
  createdAt: { type: Date, default: Date.now }
});

export const RefundModel = mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema);
