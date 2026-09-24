import bcrypt from 'bcryptjs';
import {
  SEED_MOVIES,
  SEED_THEATRES,
  SEED_SCREENS,
  generateSeatsForScreen,
  SEED_FOOD_ITEMS,
  generateSeedShows
} from '../seed/seedData.js';
import { isConnectedToMongo } from '../config/db.js';
import {
  UserModel,
  MovieModel,
  TheatreModel,
  ScreenModel,
  SeatModel,
  ShowModel,
  FoodItemModel,
  BookingModel,
  PaymentModel,
  RefundModel,
  IUser,
  IMovie,
  ITheatre,
  IScreen,
  ISeat,
  IShow,
  IFoodItem,
  IBooking,
  IPayment,
  IRefund
} from '../models/index.js';

// In-Memory Storage maps
interface IStore {
  users: Map<string, any>;
  movies: Map<string, any>;
  theatres: Map<string, any>;
  screens: Map<string, any>;
  seats: Map<string, any>;
  shows: Map<string, any>;
  foodItems: Map<string, any>;
  bookings: Map<string, any>;
  payments: Map<string, any>;
  refunds: Map<string, any>;
}

const memoryStore: IStore = {
  users: new Map(),
  movies: new Map(),
  theatres: new Map(),
  screens: new Map(),
  seats: new Map(),
  shows: new Map(),
  foodItems: new Map(),
  bookings: new Map(),
  payments: new Map(),
  refunds: new Map()
};

let isInitialized = false;

export async function initDatabaseStore() {
  if (isInitialized) return;

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const userPasswordHash = await bcrypt.hash('User@123', salt);

  const demoUsers = [
    {
      _id: 'usr_admin',
      name: 'Cinema Administrator',
      email: 'admin@cinebook.com',
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date()
    },
    {
      _id: 'usr_demo',
      name: 'John Doe',
      email: 'user@cinebook.com',
      password: userPasswordHash,
      role: 'user',
      createdAt: new Date()
    }
  ];

  // Seed memory store
  demoUsers.forEach(u => memoryStore.users.set(u._id, { ...u }));
  SEED_MOVIES.forEach(m => memoryStore.movies.set(m._id, { ...m }));
  SEED_THEATRES.forEach(t => memoryStore.theatres.set(t._id, { ...t }));
  SEED_SCREENS.forEach(s => memoryStore.screens.set(s._id, { ...s }));

  SEED_SCREENS.forEach(screen => {
    const seats = generateSeatsForScreen(screen._id);
    seats.forEach(seat => memoryStore.seats.set(seat._id, { ...seat }));
  });

  SEED_FOOD_ITEMS.forEach(f => memoryStore.foodItems.set(f._id, { ...f }));

  const shows = generateSeedShows();
  shows.forEach(show => memoryStore.shows.set(show._id, { ...show }));

  // If connected to live MongoDB, seed Mongo collections if empty
  if (isConnectedToMongo) {
    try {
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        await UserModel.insertMany(demoUsers);
        await MovieModel.insertMany(SEED_MOVIES);
        await TheatreModel.insertMany(SEED_THEATRES);
        await ScreenModel.insertMany(SEED_SCREENS);

        const allSeats: any[] = [];
        SEED_SCREENS.forEach(sc => {
          allSeats.push(...generateSeatsForScreen(sc._id));
        });
        await SeatModel.insertMany(allSeats);
        await FoodItemModel.insertMany(SEED_FOOD_ITEMS);
        await ShowModel.insertMany(shows);
        console.log('[Database] Seeded live MongoDB with complete CineBook catalog!');
      }
    } catch (e) {
      console.error('[Database] Mongo sync warning:', e);
    }
  }

  isInitialized = true;
  console.log(`[Database] CineBook data store ready. Movies: ${memoryStore.movies.size}, Theatres: ${memoryStore.theatres.size}, Shows: ${memoryStore.shows.size}, Food: ${memoryStore.foodItems.size}`);
}

// Data Store Accessors
export const DataStore = {
  // Users
  async findUserByEmail(email: string) {
    if (isConnectedToMongo) {
      try {
        const u = await UserModel.findOne({ email: email.toLowerCase() });
        if (u) return u.toObject();
      } catch (err) {}
    }
    const cleanEmail = email.toLowerCase().trim();
    for (const user of memoryStore.users.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return user;
      }
    }
    return null;
  },

  async findUserById(id: string) {
    if (isConnectedToMongo) {
      try {
        const u = await UserModel.findById(id);
        if (u) return u.toObject();
      } catch (err) {}
    }
    return memoryStore.users.get(id) || null;
  },

  async createUser(userData: { name: string; email: string; password: string; role?: 'user' | 'admin' }) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user = {
      _id: id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role || 'user',
      createdAt: new Date()
    };
    memoryStore.users.set(id, user);

    if (isConnectedToMongo) {
      try {
        await UserModel.create(user);
      } catch (err) {}
    }
    return user;
  },

  // Movies
  async getMovies(filter?: { genre?: string; language?: string; status?: string; search?: string }) {
    if (isConnectedToMongo) {
      try {
        const query: any = { isActive: true };
        if (filter?.status) query.status = filter.status;
        if (filter?.language) query.language = filter.language;
        if (filter?.genre) query.genre = filter.genre;
        if (filter?.search) query.title = { $regex: filter.search, $options: 'i' };
        const movies = await MovieModel.find(query);
        if (movies && movies.length > 0) return movies.map(m => m.toObject());
      } catch (err) {}
    }

    let list = Array.from(memoryStore.movies.values()).filter(m => m.isActive !== false);

    if (filter?.status) {
      list = list.filter(m => m.status === filter.status);
    }
    if (filter?.language) {
      list = list.filter(m => m.language.toLowerCase() === filter.language?.toLowerCase());
    }
    if (filter?.genre) {
      list = list.filter(m => m.genre.some((g: string) => g.toLowerCase() === filter.genre?.toLowerCase()));
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(q) || m.genre.some((g: string) => g.toLowerCase().includes(q)));
    }
    return list;
  },

  async getMovieById(id: string) {
    if (isConnectedToMongo) {
      try {
        const m = await MovieModel.findById(id);
        if (m) return m.toObject();
      } catch (err) {}
    }
    return memoryStore.movies.get(id) || null;
  },

  async createMovie(movieData: any) {
    const id = movieData._id || `mov_${Date.now()}`;
    const movie = {
      _id: id,
      ...movieData,
      isActive: true,
      createdAt: new Date()
    };
    memoryStore.movies.set(id, movie);
    if (isConnectedToMongo) {
      try {
        await MovieModel.create(movie);
      } catch (err) {}
    }
    return movie;
  },

  async updateMovie(id: string, updateData: any) {
    const existing = memoryStore.movies.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updateData };
    memoryStore.movies.set(id, updated);
    if (isConnectedToMongo) {
      try {
        await MovieModel.findByIdAndUpdate(id, updateData, { new: true });
      } catch (err) {}
    }
    return updated;
  },

  async deleteMovie(id: string) {
    const existing = memoryStore.movies.get(id);
    if (!existing) return false;
    // soft delete
    existing.isActive = false;
    memoryStore.movies.set(id, existing);
    if (isConnectedToMongo) {
      try {
        await MovieModel.findByIdAndUpdate(id, { isActive: false });
      } catch (err) {}
    }
    return true;
  },

  // Theatres
  async getTheatres() {
    if (isConnectedToMongo) {
      try {
        const t = await TheatreModel.find({ isActive: true });
        if (t && t.length > 0) return t.map(x => x.toObject());
      } catch (err) {}
    }
    return Array.from(memoryStore.theatres.values()).filter(t => t.isActive !== false);
  },

  async getTheatreById(id: string) {
    if (isConnectedToMongo) {
      try {
        const t = await TheatreModel.findById(id);
        if (t) return t.toObject();
      } catch (err) {}
    }
    return memoryStore.theatres.get(id) || null;
  },

  async createTheatre(theatreData: any) {
    const id = theatreData._id || `th_${Date.now()}`;
    const theatre = {
      _id: id,
      ...theatreData,
      isActive: true,
      createdAt: new Date()
    };
    memoryStore.theatres.set(id, theatre);

    // Also auto-create default 2 screens
    const scr1 = {
      _id: `scr_${Date.now()}_1`,
      theatreId: id,
      name: 'Audi 1 - Laser 4K',
      type: 'Dolby Atmos',
      totalSeats: 60
    };
    const scr2 = {
      _id: `scr_${Date.now()}_2`,
      theatreId: id,
      name: 'Audi 2 - IMAX Experience',
      type: 'IMAX',
      totalSeats: 60
    };
    memoryStore.screens.set(scr1._id, scr1);
    memoryStore.screens.set(scr2._id, scr2);

    // Generate seats
    generateSeatsForScreen(scr1._id).forEach(s => memoryStore.seats.set(s._id, s));
    generateSeatsForScreen(scr2._id).forEach(s => memoryStore.seats.set(s._id, s));

    if (isConnectedToMongo) {
      try {
        await TheatreModel.create(theatre);
        await ScreenModel.create(scr1);
        await ScreenModel.create(scr2);
      } catch (err) {}
    }
    return theatre;
  },

  // Screens
  async getScreensByTheatre(theatreId: string) {
    return Array.from(memoryStore.screens.values()).filter(s => s.theatreId === theatreId);
  },

  async getScreenById(id: string) {
    return memoryStore.screens.get(id) || null;
  },

  // Shows
  async getShows(filter?: { movieId?: string; date?: string; theatreId?: string }) {
    let shows = Array.from(memoryStore.shows.values()).filter(s => s.isActive !== false);

    if (filter?.movieId) {
      shows = shows.filter(s => s.movieId === filter.movieId);
    }
    if (filter?.date) {
      shows = shows.filter(s => s.date === filter.date);
    }
    if (filter?.theatreId) {
      shows = shows.filter(s => s.theatreId === filter.theatreId);
    }

    // Enrich with movie, theatre, and screen metadata
    return shows.map(show => {
      const movie = memoryStore.movies.get(show.movieId);
      const theatre = memoryStore.theatres.get(show.theatreId);
      const screen = memoryStore.screens.get(show.screenId);
      return {
        ...show,
        movieTitle: movie?.title || 'Unknown Movie',
        theatreName: theatre?.name || 'Unknown Theatre',
        theatreLocation: theatre?.location || '',
        screenName: screen?.name || 'Screen 1',
        screenType: screen?.type || 'Dolby Atmos'
      };
    });
  },

  async getShowById(id: string) {
    const show = memoryStore.shows.get(id);
    if (!show) return null;

    // Filter out expired seat locks
    const now = new Date();
    if (show.lockedSeats) {
      show.lockedSeats = show.lockedSeats.filter((lock: any) => new Date(lock.lockedUntil) > now);
    }

    const movie = memoryStore.movies.get(show.movieId);
    const theatre = memoryStore.theatres.get(show.theatreId);
    const screen = memoryStore.screens.get(show.screenId);

    return {
      ...show,
      movieTitle: movie?.title || 'Unknown Movie',
      moviePoster: movie?.poster || '',
      certification: movie?.certification || 'UA',
      duration: movie?.duration || '120 min',
      theatreName: theatre?.name || 'Unknown Theatre',
      theatreLocation: theatre?.location || '',
      screenName: screen?.name || 'Screen 1',
      screenType: screen?.type || 'Standard'
    };
  },

  async createShow(showData: any) {
    const id = showData._id || `show_${Date.now()}`;
    const show = {
      _id: id,
      ...showData,
      bookedSeats: showData.bookedSeats || [],
      lockedSeats: [],
      prices: showData.prices || { Regular: 220, Premium: 340, Recliner: 520 },
      isActive: true,
      createdAt: new Date()
    };
    memoryStore.shows.set(id, show);
    if (isConnectedToMongo) {
      try {
        await ShowModel.create(show);
      } catch (err) {}
    }
    return show;
  },

  // Seats & Seat Locking
  async getSeatsForShow(showId: string, currentUserIdOrSession?: string) {
    const show = await this.getShowById(showId);
    if (!show) return null;

    const screenSeats = Array.from(memoryStore.seats.values())
      .filter(s => s.screenId === show.screenId);

    const now = new Date();
    const activeLocks = (show.lockedSeats || []).filter((l: any) => new Date(l.lockedUntil) > now);

    // Map each seat to state: 'AVAILABLE' | 'SELECTED' | 'BOOKED'
    const seatsWithState = screenSeats.map(seat => {
      const isBooked = (show.bookedSeats || []).includes(seat.seatNumber);
      const lock = activeLocks.find((l: any) => l.seatNumber === seat.seatNumber);

      let status: 'AVAILABLE' | 'SELECTED' | 'BOOKED' = 'AVAILABLE';
      let isLockedByMe = false;

      if (isBooked) {
        status = 'BOOKED';
      } else if (lock) {
        if (currentUserIdOrSession && lock.lockedBy === currentUserIdOrSession) {
          status = 'SELECTED';
          isLockedByMe = true;
        } else {
          status = 'BOOKED'; // locked by another user shows as unavailable/booked to others
        }
      }

      const price = show.prices?.[seat.category as 'Regular' | 'Premium' | 'Recliner'] || 250;

      return {
        _id: seat._id,
        seatNumber: seat.seatNumber,
        row: seat.row,
        number: seat.number,
        category: seat.category,
        price,
        status,
        isLockedByMe
      };
    });

    return {
      show,
      seats: seatsWithState
    };
  },

  // Lock seats for 5 minutes
  async lockSeats(showId: string, seatNumbers: string[], userIdOrSession: string) {
    const show = memoryStore.shows.get(showId);
    if (!show) throw new Error('Show not found');

    const now = new Date();
    // Clean expired locks
    show.lockedSeats = (show.lockedSeats || []).filter((l: any) => new Date(l.lockedUntil) > now);

    // Verify none of the requested seats are booked
    for (const sNum of seatNumbers) {
      if ((show.bookedSeats || []).includes(sNum)) {
        throw new Error(`Seat ${sNum} has already been booked by another customer.`);
      }
      // Check if locked by someone else
      const existingLock = show.lockedSeats.find((l: any) => l.seatNumber === sNum);
      if (existingLock && existingLock.lockedBy !== userIdOrSession) {
        throw new Error(`Seat ${sNum} is currently held by another user. Please choose another seat.`);
      }
    }

    // Set lock for 5 minutes (300,000 ms)
    const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);

    // Remove any previous locks by this user on seats that are no longer selected
    show.lockedSeats = show.lockedSeats.filter((l: any) => l.lockedBy !== userIdOrSession);

    // Add new locks
    for (const sNum of seatNumbers) {
      show.lockedSeats.push({
        seatNumber: sNum,
        lockedBy: userIdOrSession,
        lockedUntil
      });
    }

    memoryStore.shows.set(showId, show);
    return {
      success: true,
      lockedSeats: seatNumbers,
      lockedUntil
    };
  },

  async unlockSeats(showId: string, userIdOrSession: string) {
    const show = memoryStore.shows.get(showId);
    if (!show) return;
    show.lockedSeats = (show.lockedSeats || []).filter((l: any) => l.lockedBy !== userIdOrSession);
    memoryStore.shows.set(showId, show);
  },

  // Food Items
  async getFoodItems() {
    if (isConnectedToMongo) {
      try {
        const items = await FoodItemModel.find({ available: true });
        if (items && items.length > 0) return items.map(f => f.toObject());
      } catch (err) {}
    }
    return Array.from(memoryStore.foodItems.values()).filter(f => f.available !== false);
  },

  // Bookings
  async createBooking(bookingRequest: {
    userId: string;
    userEmail: string;
    userName: string;
    showId: string;
    seatNumbers: string[];
    snacks?: { foodItemId: string; quantity: number }[];
    sessionToken: string;
  }) {
    const show = memoryStore.shows.get(bookingRequest.showId);
    if (!show) throw new Error('Show does not exist.');

    // 1. RACE CONDITION CHECK & SEAT VALIDATION
    const now = new Date();
    show.lockedSeats = (show.lockedSeats || []).filter((l: any) => new Date(l.lockedUntil) > now);

    for (const seatNum of bookingRequest.seatNumbers) {
      // Re-check: Is seat already booked?
      if ((show.bookedSeats || []).includes(seatNum)) {
        throw new Error(`Seat ${seatNum} is already booked! Please select another seat.`);
      }

      // Check lock ownership: Must be locked by this user or session
      const lock = show.lockedSeats.find((l: any) => l.seatNumber === seatNum);
      if (lock && lock.lockedBy !== bookingRequest.userId && lock.lockedBy !== bookingRequest.sessionToken) {
        throw new Error(`Seat ${seatNum} is reserved by another customer.`);
      }
    }

    // 2. BACKEND PRICE RECALCULATION (NEVER TRUST CLIENT AMOUNTS)
    const movie = memoryStore.movies.get(show.movieId);
    const theatre = memoryStore.theatres.get(show.theatreId);
    const screen = memoryStore.screens.get(show.screenId);
    const screenSeats = Array.from(memoryStore.seats.values()).filter(s => s.screenId === show.screenId);

    const seatDetails: any[] = [];
    let ticketAmount = 0;

    for (const seatNum of bookingRequest.seatNumbers) {
      const seatObj = screenSeats.find(s => s.seatNumber === seatNum);
      const cat = seatObj?.category || 'Regular';
      const price = show.prices?.[cat as 'Regular' | 'Premium' | 'Recliner'] || 220;
      seatDetails.push({
        seatNumber: seatNum,
        category: cat,
        price
      });
      ticketAmount += price;
    }

    // Calculate snacks
    const snackDetails: any[] = [];
    let snackAmount = 0;

    if (bookingRequest.snacks && bookingRequest.snacks.length > 0) {
      for (const item of bookingRequest.snacks) {
        if (item.quantity > 0) {
          const foodItem = memoryStore.foodItems.get(item.foodItemId);
          if (foodItem) {
            const itemCost = foodItem.price * item.quantity;
            snackAmount += itemCost;
            snackDetails.push({
              foodItemId: foodItem._id,
              name: foodItem.name,
              price: foodItem.price,
              quantity: item.quantity
            });
          }
        }
      }
    }

    const convenienceFee = 40;
    const discount = 0;
    const totalAmount = ticketAmount + snackAmount + convenienceFee - discount;

    // Unique Booking ID: CB-XXXXXX
    const bookingId = `CB-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    const booking: IBooking = {
      _id: `bkg_${Date.now()}`,
      bookingId,
      userId: bookingRequest.userId,
      userEmail: bookingRequest.userEmail,
      userName: bookingRequest.userName,
      movieId: show.movieId,
      movieTitle: movie?.title || 'Featured Movie',
      theatreId: show.theatreId,
      theatreName: theatre?.name || 'CineBook Cinema',
      theatreLocation: theatre?.location || 'Multiplex Complex',
      screenId: show.screenId,
      screenName: screen?.name || 'Audi 1',
      showId: show._id,
      showDate: show.date,
      showTime: show.time,
      seats: seatDetails,
      snacks: snackDetails,
      ticketAmount,
      snackAmount,
      convenienceFee,
      discount,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date()
    } as any;

    // 3. ATOMICALLY MARK SEATS AS BOOKED AND RELEASE LOCKS
    show.bookedSeats = [...(show.bookedSeats || []), ...bookingRequest.seatNumbers];
    show.lockedSeats = (show.lockedSeats || []).filter(
      (l: any) => !bookingRequest.seatNumbers.includes(l.seatNumber)
    );
    memoryStore.shows.set(show._id, show);

    // Save booking
    memoryStore.bookings.set(String(booking._id), booking);

    // 4. GENERATE PAYMENT RECORD (Simulated)
    const paymentId = `PAY-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const payment: IPayment = {
      _id: `pay_${Date.now()}`,
      paymentId,
      bookingId: booking.bookingId,
      amount: totalAmount,
      status: 'SUCCESS',
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      method: 'Demo UPI / Card',
      createdAt: new Date()
    } as any;
    memoryStore.payments.set(String(payment._id), payment);

    if (isConnectedToMongo) {
      try {
        await BookingModel.create(booking);
        await PaymentModel.create(payment);
        await ShowModel.findByIdAndUpdate(String(show._id), {
          bookedSeats: show.bookedSeats,
          lockedSeats: show.lockedSeats
        });
      } catch (err) {
        console.error('Mongo booking sync error:', err);
      }
    }

    return {
      booking,
      payment
    };
  },

  async getBookingsByUser(userId: string) {
    if (isConnectedToMongo) {
      try {
        const b = await BookingModel.find({ userId }).sort({ createdAt: -1 });
        if (b && b.length > 0) return b.map(x => x.toObject());
      } catch (err) {}
    }
    return Array.from(memoryStore.bookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getBookingById(bookingId: string) {
    // Support either _id or human bookingId like "CB-1234"
    if (isConnectedToMongo) {
      try {
        const b = await BookingModel.findOne({
          $or: [{ bookingId }, { _id: bookingId }]
        });
        if (b) return b.toObject();
      } catch (err) {}
    }

    for (const b of memoryStore.bookings.values()) {
      if (b.bookingId === bookingId || b._id === bookingId) {
        return b;
      }
    }
    return null;
  },

  async getAllBookings() {
    if (isConnectedToMongo) {
      try {
        const b = await BookingModel.find().sort({ createdAt: -1 });
        if (b && b.length > 0) return b.map(x => x.toObject());
      } catch (err) {}
    }
    return Array.from(memoryStore.bookings.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Cancellation with 30-minute policy
  async cancelBooking(bookingId: string, userId: string, isAdmin = false) {
    const booking = await this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (!isAdmin && booking.userId !== userId) {
      throw new Error('Unauthorized: You can only cancel your own bookings.');
    }

    if (booking.bookingStatus === 'CANCELLED') {
      throw new Error('This booking is already cancelled.');
    }

    // Cancellation rule: Allowed until 30 minutes before showtime
    try {
      // Parse showDate (YYYY-MM-DD) and showTime (e.g. 10:30 AM or 08:30 PM)
      const datePart = booking.showDate; // e.g. "2024-09-24"
      const timePart = booking.showTime; // e.g. "08:30 PM"
      const showDateTime = new Date(`${datePart} ${timePart}`);

      // If valid date, check 30 minutes rule
      if (!isNaN(showDateTime.getTime())) {
        const now = new Date();
        const diffInMinutes = (showDateTime.getTime() - now.getTime()) / (1000 * 60);

        // If the show was today and already past or within 30 minutes
        if (diffInMinutes < 30 && !isAdmin) {
          // If the show date is today and less than 30 mins, block cancellation
          const todayStr = new Date().toISOString().split('T')[0];
          if (booking.showDate === todayStr) {
            throw new Error('Cancellation is only permitted at least 30 minutes prior to showtime.');
          }
        }
      }
    } catch (e: any) {
      if (e.message.includes('Cancellation is only permitted')) {
        throw e;
      }
    }

    // Release seats in the Show document
    const show = memoryStore.shows.get(booking.showId);
    if (show && show.bookedSeats) {
      const seatNumsToRelease = booking.seats.map((s: any) => s.seatNumber);
      show.bookedSeats = show.bookedSeats.filter((s: string) => !seatNumsToRelease.includes(s));
      memoryStore.shows.set(show._id, show);

      if (isConnectedToMongo) {
        try {
          await ShowModel.findByIdAndUpdate(show._id, { bookedSeats: show.bookedSeats });
        } catch (e) {}
      }
    }

    // Generate Refund
    const refundId = `REF-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;
    const refund: IRefund = {
      _id: `ref_${Date.now()}`,
      refundId,
      bookingId: booking.bookingId,
      amount: booking.totalAmount,
      status: 'INITIATED',
      reason: 'User cancelled booking within eligible window. 100% refund initiated to source payment.',
      createdAt: new Date()
    } as any;
    memoryStore.refunds.set(String(refund._id), refund);

    // Update booking status
    booking.bookingStatus = 'CANCELLED';
    booking.cancellationReason = 'User cancelled booking. Refund processed.';
    booking.refundId = refundId;
    memoryStore.bookings.set(booking._id, booking);

    if (isConnectedToMongo) {
      try {
        await RefundModel.create(refund);
        await BookingModel.findByIdAndUpdate(String(booking._id), {
          bookingStatus: 'CANCELLED',
          cancellationReason: booking.cancellationReason,
          refundId: refund.refundId
        });
      } catch (e) {}
    }

    return {
      booking,
      refund
    };
  },

  // Admin Stats
  async getAdminStats() {
    const movies = Array.from(memoryStore.movies.values()).filter(m => m.isActive !== false);
    const theatres = Array.from(memoryStore.theatres.values()).filter(t => t.isActive !== false);
    const shows = Array.from(memoryStore.shows.values()).filter(s => s.isActive !== false);
    const bookings = Array.from(memoryStore.bookings.values());

    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
    const revenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      totalMovies: movies.length,
      totalTheatres: theatres.length,
      totalShows: shows.length,
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: bookings.length - confirmedBookings.length,
      totalRevenue: revenue,
      recentBookings: bookings.slice(0, 10)
    };
  }
};
