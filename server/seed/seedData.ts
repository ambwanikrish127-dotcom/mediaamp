// Master Seed Dataset for CineBook Cinema Application

export const SEED_CITIES = [
  { _id: 'city_1', name: 'Jaipur', state: 'Rajasthan', country: 'India', slug: 'jaipur', isActive: true },
  { _id: 'city_2', name: 'Delhi', state: 'Delhi NCR', country: 'India', slug: 'delhi', isActive: true },
  { _id: 'city_3', name: 'Mumbai', state: 'Maharashtra', country: 'India', slug: 'mumbai', isActive: true },
  { _id: 'city_4', name: 'Bangalore', state: 'Karnataka', country: 'India', slug: 'bangalore', isActive: true },
  { _id: 'city_5', name: 'Hyderabad', state: 'Telangana', country: 'India', slug: 'hyderabad', isActive: true },
  { _id: 'city_6', name: 'Pune', state: 'Maharashtra', country: 'India', slug: 'pune', isActive: true },
  { _id: 'city_7', name: 'Chandigarh', state: 'Punjab', country: 'India', slug: 'chandigarh', isActive: true },
  { _id: 'city_8', name: 'Kolkata', state: 'West Bengal', country: 'India', slug: 'kolkata', isActive: true },
  { _id: 'city_9', name: 'Chennai', state: 'Tamil Nadu', country: 'India', slug: 'chennai', isActive: true },
  { _id: 'city_10', name: 'Ahmedabad', state: 'Gujarat', country: 'India', slug: 'ahmedabad', isActive: true }
];

export const SEED_MOVIES = [
  {
    _id: 'mov_1',
    title: 'Interstellar: 10th Anniversary IMAX',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    rating: 8.7,
    duration: '169 min',
    certification: 'UA',
    releaseDate: '2024-09-15',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_2',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    language: 'English',
    rating: 8.6,
    duration: '166 min',
    certification: 'UA 16+',
    releaseDate: '2024-03-01',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_3',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    rating: 8.9,
    duration: '180 min',
    certification: 'A',
    releaseDate: '2023-07-21',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_4',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    rating: 9.0,
    duration: '152 min',
    certification: 'UA',
    releaseDate: '2024-01-10',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_5',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    rating: 8.7,
    duration: '140 min',
    certification: 'U',
    releaseDate: '2023-06-02',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_6',
    title: 'Kalki 2898 AD',
    description: 'A modern avatar of Hindu god Vishnu descends to earth to protect the world from evil forces in a dystopian post-apocalyptic future.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&auto=format&fit=crop&q=80',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Hindi',
    rating: 7.8,
    duration: '181 min',
    certification: 'UA 16+',
    releaseDate: '2024-06-27',
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_7',
    title: 'Gladiator II',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered.',
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&auto=format&fit=crop&q=80',
    genre: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    rating: 7.9,
    duration: '148 min',
    certification: 'A',
    releaseDate: '2024-11-15',
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_8',
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Fantasy'],
    language: 'English',
    rating: 7.6,
    duration: '192 min',
    certification: 'UA',
    releaseDate: '2022-12-16',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    status: 'NOW_SHOWING',
    isActive: true
  },
  {
    _id: 'mov_9',
    title: 'Avatar: Fire and Ash',
    description: 'The continuing epic saga of the Sully family across new volcanic biomes of Pandora, introducing the hostile Ash People.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    rating: 8.5,
    duration: '185 min',
    certification: 'UA',
    releaseDate: '2025-12-19',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Michelle Yeoh'],
    status: 'COMING_SOON',
    isActive: true
  },
  {
    _id: 'mov_10',
    title: 'Batman: The Brave and the Bold',
    description: 'The DC universe introduces a new live-action caped crusader alongside his biological son Damian Wayne as Robin.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
    genre: ['Action', 'Adventure', 'Fantasy'],
    language: 'English',
    rating: 8.4,
    duration: '150 min',
    certification: 'UA',
    releaseDate: '2026-06-10',
    director: 'Andy Muschietti',
    cast: ['To be announced'],
    status: 'COMING_SOON',
    isActive: true
  }
];

// Theatres across key Indian cities (Jaipur, Delhi, Mumbai, Bangalore, Hyderabad, Pune, etc.)
export const SEED_THEATRES = [
  // --- JAIPUR ---
  {
    _id: 'th_jpr_1',
    name: 'PVR C-Scheme',
    city: 'Jaipur',
    citySlug: 'jaipur',
    address: 'C-Scheme, Ashok Nagar, Near Statue Circle, Jaipur',
    location: 'C-Scheme, Ashok Nagar, Jaipur',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['IMAX 4K Laser', 'Dolby Atmos', 'Recliner Seating', 'Gourmet Lounge', 'Wheelchair Accessible', 'Valet Parking'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_jpr_2',
    name: 'INOX GT Central',
    city: 'Jaipur',
    citySlug: 'jaipur',
    address: 'GT Central Mall, Gaurav Tower Marg, Malviya Nagar, Jaipur',
    location: 'GT Central Mall, Malviya Nagar, Jaipur',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Dolby Atmos', 'Insignia Dining', 'Recliners', 'F&B Service to Seat', 'Parking'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_jpr_3',
    name: 'Raj Mandir Cinema',
    city: 'Jaipur',
    citySlug: 'jaipur',
    address: 'Bhagwan Das Road, C-Scheme, Jaipur',
    location: 'Bhagwan Das Road, Jaipur',
    images: [
      'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Heritage Art Deco', '70mm Projection', 'Dolby Surround 7.1', 'Royal Seating', 'Concessions'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },

  // --- DELHI ---
  {
    _id: 'th_del_1',
    name: 'PVR Select City',
    city: 'Delhi',
    citySlug: 'delhi',
    address: 'Select CITYWALK Mall, A-3 District Centre, Saket, New Delhi',
    location: 'Select CITYWALK, Saket, New Delhi',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['IMAX Laser', 'Gold Class Recliners', 'Dolby Atmos', 'Valet Parking'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_del_2',
    name: 'INOX Nehru Place',
    city: 'Delhi',
    citySlug: 'delhi',
    address: 'Epicuria Food Mall, Metro Station, Nehru Place, New Delhi',
    location: 'Nehru Place, New Delhi',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Dolby Atmos', 'Insignia', 'Laser 4K', 'Metro Connectivity'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },

  // --- MUMBAI ---
  {
    _id: 'th_mum_1',
    name: 'PVR Phoenix',
    city: 'Mumbai',
    citySlug: 'mumbai',
    address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai',
    location: 'Phoenix Palladium, Lower Parel, Mumbai',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['IMAX with Laser', 'PXL Giant Screen', 'Dolby Atmos', 'Luxe Dining'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_mum_2',
    name: 'INOX Mall',
    city: 'Mumbai',
    citySlug: 'mumbai',
    address: 'R-City Mall, LBS Marg, Ghatkopar West, Mumbai',
    location: 'R-City Mall, Ghatkopar, Mumbai',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Dolby Atmos', 'MX4D Motion', 'Laser 4K', 'Gourmet Cafe'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },

  // --- BANGALORE ---
  {
    _id: 'th_blr_1',
    name: 'PVR Forum Mall',
    city: 'Bangalore',
    citySlug: 'bangalore',
    address: 'The Forum Mall, 21 Hosur Road, Koramangala, Bangalore',
    location: 'Forum Mall, Koramangala, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['IMAX Laser', 'Gold Class Recliners', 'Dolby Atmos', 'Parking'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_blr_2',
    name: 'INOX Garuda Mall',
    city: 'Bangalore',
    citySlug: 'bangalore',
    address: 'Garuda Mall, Magrath Road, Ashok Nagar, Bangalore',
    location: 'Garuda Mall, Magrath Road, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Dolby Atmos', 'Insignia', 'Laser 4K', 'Concessions'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },

  // --- HYDERABAD ---
  {
    _id: 'th_hyd_1',
    name: 'PVR Next Galleria',
    city: 'Hyderabad',
    citySlug: 'hyderabad',
    address: 'Next Galleria Mall, Punjagutta, Hyderabad',
    location: 'Next Galleria Mall, Punjagutta, Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['4DX', 'Dolby Atmos', 'Playhouse', 'Recliners'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_hyd_2',
    name: 'INOX GVK One',
    city: 'Hyderabad',
    citySlug: 'hyderabad',
    address: 'GVK One Mall, Road No. 1, Banjara Hills, Hyderabad',
    location: 'GVK One Mall, Banjara Hills, Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['Insignia Recliners', 'Dolby Atmos 4K', 'Valet Parking'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },

  // --- PUNE ---
  {
    _id: 'th_pun_1',
    name: 'PVR Phoenix Marketcity',
    city: 'Pune',
    citySlug: 'pune',
    address: 'Phoenix Marketcity, Viman Nagar, Pune',
    location: 'Phoenix Marketcity, Viman Nagar, Pune',
    images: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['PXL Screen', '4DX', 'Dolby Atmos', 'Recliners'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  },
  {
    _id: 'th_pun_2',
    name: 'Cinepolis Westend',
    city: 'Pune',
    citySlug: 'pune',
    address: 'Westend Mall, Aundh, Pune',
    location: 'Westend Mall, Aundh, Pune',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80'
    ],
    facilities: ['VIP Recliner Service', 'Dolby Atmos', 'Macro XE'],
    totalScreens: 2,
    status: 'ACTIVE',
    isActive: true
  }
];

// Screen generator for each theatre
export const SEED_SCREENS = SEED_THEATRES.flatMap(t => [
  { _id: `scr_${t._id}_1`, theatreId: t._id, name: 'Audi 1 - Laser Atmos', type: 'Dolby Atmos', totalSeats: 60 },
  { _id: `scr_${t._id}_2`, theatreId: t._id, name: 'Audi 2 - IMAX Experience', type: 'IMAX Laser', totalSeats: 60 }
]);

// Helper to generate 60 seats per screen
// A & B: Regular (10 each = 20)
// C, D, E: Premium (10 each = 30)
// F: Recliner (10 = 10)
export function generateSeatsForScreen(screenId: string) {
  const seats = [];
  const rows = [
    { row: 'A', category: 'Regular' as const },
    { row: 'B', category: 'Regular' as const },
    { row: 'C', category: 'Premium' as const },
    { row: 'D', category: 'Premium' as const },
    { row: 'E', category: 'Premium' as const },
    { row: 'F', category: 'Recliner' as const },
  ];

  for (const { row, category } of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({
        _id: `seat_${screenId}_${row}${num}`,
        screenId,
        seatNumber: `${row}${num}`,
        row,
        number: num,
        category
      });
    }
  }
  return seats;
}

export const SEED_FOOD_ITEMS = [
  // Popcorn
  {
    _id: 'food_1',
    name: 'Classic Salted Butter Popcorn (Large)',
    category: 'Popcorn',
    price: 220,
    image: '🍿',
    description: 'Hot and freshly popped tender corn drenched in rich melted butter and sea salt.',
    available: true
  },
  {
    _id: 'food_2',
    name: 'Golden Caramel Crunch Popcorn (Tub)',
    category: 'Popcorn',
    price: 260,
    image: '🍿',
    description: 'Crispy mushroom kernels generously glazed in artisanal caramelized brown sugar.',
    available: true
  },
  {
    _id: 'food_3',
    name: 'Peri Peri Spicy Popcorn (Large)',
    category: 'Popcorn',
    price: 240,
    image: '🍿',
    description: 'Fiery African bird’s eye chili seasoning shaken over warm buttered popcorn.',
    available: true
  },
  {
    _id: 'food_4',
    name: 'Cheddar Cheese Burst Popcorn (Tub)',
    category: 'Popcorn',
    price: 270,
    image: '🍿',
    description: 'Velvety aged cheddar dust coating every crunchy piece for pure savory bliss.',
    available: true
  },
  {
    _id: 'food_5',
    name: 'Truffle & Parmesan Gourmet Popcorn',
    category: 'Popcorn',
    price: 310,
    image: '🍿',
    description: 'Infused with Italian white truffle oil and freshly grated hard parmesan.',
    available: true
  },

  // Beverages
  {
    _id: 'food_6',
    name: 'Coca-Cola Zero Sugar (Fountain 600ml)',
    category: 'Beverages',
    price: 150,
    image: '🥤',
    description: 'Chilled bubbly fountain soda with crisp taste and zero calories.',
    available: true
  },
  {
    _id: 'food_7',
    name: 'Classic Ice-Cold Coca-Cola (600ml)',
    category: 'Beverages',
    price: 150,
    image: '🥤',
    description: 'Refreshing fountain Coca-Cola poured over crushed crystal ice.',
    available: true
  },
  {
    _id: 'food_8',
    name: 'Sprite Lemon-Lime Sparkle (600ml)',
    category: 'Beverages',
    price: 150,
    image: '🥤',
    description: 'Crisp, refreshing lemon-lime citrus soda served ice-cold.',
    available: true
  },
  {
    _id: 'food_9',
    name: 'Peach & Mint Handcrafted Iced Tea (500ml)',
    category: 'Beverages',
    price: 180,
    image: '🧃',
    description: 'Brewed black tea infused with sweet peach nectar and wild garden mint.',
    available: true
  },
  {
    _id: 'food_10',
    name: 'Belgian Cold Brew Mocha Latte',
    category: 'Beverages',
    price: 210,
    image: '☕',
    description: 'Single-origin Arabica steeped for 18 hours, blended with rich cocoa & milk.',
    available: true
  },

  // Combos
  {
    _id: 'food_11',
    name: 'Solo Movie Craver Combo',
    category: 'Combos',
    price: 360,
    image: '🍿🥤',
    description: '1 Large Butter Popcorn + 1 Medium Fountain Beverage of your choice.',
    available: true
  },
  {
    _id: 'food_12',
    name: 'Couple Movie Night Duo Combo',
    category: 'Combos',
    price: 590,
    image: '🍿🥤🥤',
    description: '1 Tub Golden Caramel Popcorn + 2 Large Fountain Sodas + 1 Salted Fries.',
    available: true
  },
  {
    _id: 'food_13',
    name: 'Blockbuster Family Feast',
    category: 'Combos',
    price: 890,
    image: '🍿🥤🍔',
    description: '2 Jumbo Popcorn Tubs + 4 Beverages + 1 Loaded Nachos + 2 Warm Brownies.',
    available: true
  },

  // Snacks & Bites
  {
    _id: 'food_14',
    name: 'Mexican Loaded Cheesy Nachos',
    category: 'Snacks',
    price: 210,
    image: '🧀',
    description: 'Stone-ground yellow corn chips smothered with warm queso, chunky salsa & jalapeños.',
    available: true
  },
  {
    _id: 'food_15',
    name: 'Golden Salted French Fries (Large)',
    category: 'Snacks',
    price: 160,
    image: '🍟',
    description: 'Crisp on the outside, fluffy inside, served with signature tomato aioli.',
    available: true
  },
  {
    _id: 'food_16',
    name: 'Jalapeño Cream Cheese Poppers (6 Pcs)',
    category: 'Snacks',
    price: 190,
    image: '🧆',
    description: 'Crispy breaded golden bites stuffed with spicy peppers and molten cream cheese.',
    available: true
  },
  {
    _id: 'food_17',
    name: 'Crispy Paneer Makhani Burger',
    category: 'Snacks',
    price: 220,
    image: '🍔',
    description: 'Spiced crumbed cottage cheese patty topped with rich butter makhani glaze in brioche.',
    available: true
  },
  {
    _id: 'food_18',
    name: 'Grilled Herb Chicken Club Sliders (2 Pcs)',
    category: 'Snacks',
    price: 260,
    image: '🥪',
    description: 'Juicy tender smoked chicken breast slices layered with aged cheddar and lettuce.',
    available: true
  },
  {
    _id: 'food_19',
    name: 'Gooey Dark Chocolate Lava Cake',
    category: 'Snacks',
    price: 160,
    image: '🍫',
    description: 'Warm, decadent Belgian dark chocolate cake with an irresistible molten centre.',
    available: true
  },
  {
    _id: 'food_20',
    name: 'Artisan Churros with Dulce de Leche',
    category: 'Snacks',
    price: 180,
    image: '🥨',
    description: 'Golden fried Spanish dough dusted in cinnamon sugar with warm caramel dip.',
    available: true
  }
];

// Helper to generate active shows for upcoming dates
// Generates shows for all NOW_SHOWING movies in each theatre so that selecting any movie shows showtimes!
export function generateSeedShows() {
  const shows = [];
  
  // Dates: Today and next 4 days in YYYY-MM-DD
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  let showCounter = 1;
  const nowShowing = SEED_MOVIES.filter(m => m.status === 'NOW_SHOWING');

  // Standard showtime slots for cinema theatres
  const timeSlots = ['10:30 AM', '01:30 PM', '05:00 PM', '08:30 PM'];

  for (const theatre of SEED_THEATRES) {
    const screens = SEED_SCREENS.filter(s => s.theatreId === theatre._id);
    const screen1 = screens[0];
    const screen2 = screens[1] || screens[0];

    for (let dayIdx = 0; dayIdx < dates.length; dayIdx++) {
      const date = dates[dayIdx];

      // To ensure high coverage so every movie has shows in every theatre:
      // Loop through movies and assign showtimes
      for (let mIdx = 0; mIdx < nowShowing.length; mIdx++) {
        const movie = nowShowing[mIdx];
        const screen = mIdx % 2 === 0 ? screen1 : screen2;
        
        // Pick 2 to 3 showtimes for this movie
        const chosenTimes = mIdx % 2 === 0 
          ? ['10:30 AM', '05:00 PM', '08:30 PM'] 
          : ['01:30 PM', '07:30 PM', '10:15 PM'];

        for (const time of chosenTimes) {
          // Pre-book a couple of seats for realism on today's evening show
          const preBooked = (dayIdx === 0 && (time === '05:00 PM' || time === '08:30 PM')) ? ['C4', 'C5'] : [];

          shows.push({
            _id: `show_${showCounter++}`,
            movieId: movie._id,
            theatreId: theatre._id,
            screenId: screen._id,
            date,
            time,
            prices: {
              Regular: 220,
              Premium: 340,
              Recliner: 520
            },
            bookedSeats: preBooked,
            lockedSeats: [],
            isActive: true,
            createdAt: new Date()
          });
        }
      }
    }
  }

  return shows;
}
