export interface Artist {
  id: string;
  fullName: string;
  stageName: string;
  profileImage: string;
  country: string;
  city: string;
  bio: string;
  categories: string[];
  whatsapp: string;
  email: string;
  website?: string;
  socialLinks: { instagram?: string; facebook?: string; twitter?: string };
  interests: string[];
  featured: boolean;
  followerCount: number;
  artworkCount: number;
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  category: string;
  dimensions: string;
  price: number;
  currency: string;
  imageUrl: string;
  tags: string[];
  year: number;
  sold: boolean;
}

export interface MediaTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  coverImage: string;
  type: "audio" | "video";
  description: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  imageUrl: string;
  artistCount: number;
  capacity: number;
  spotsLeft: number;
}

export interface Transaction {
  id: string;
  userId: string;
  artworkId?: string;
  amount: number;
  currency: string;
  paymentMethod: "mtn_momo" | "airtel_money";
  network: string;
  status: "pending" | "completed" | "failed";
  phoneNumber: string;
  reference: string;
  createdAt: string;
  description: string;
}

export const SAMPLE_ARTISTS: Artist[] = [
  {
    id: "a1",
    fullName: "Amara Nakimuli",
    stageName: "AmaraNaki",
    profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    country: "Uganda",
    city: "Kampala",
    bio: "Contemporary painter exploring the intersection of Ugandan mythology and modern urban life. My work speaks the language of ancestral spirits through a 21st century lens.",
    categories: ["Painter", "Digital Artist"],
    whatsapp: "+256700000001",
    email: "amara@ganahub.com",
    website: "https://amaranaki.art",
    socialLinks: { instagram: "@amaranaki_art", facebook: "AmaraNakiArt" },
    interests: ["Physical exhibitions", "Virtual exhibitions", "International opportunities", "AR/immersive exhibitions"],
    featured: true,
    followerCount: 2847,
    artworkCount: 34,
  },
  {
    id: "a2",
    fullName: "Kwame Asante",
    stageName: "KwameAsante",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    country: "Ghana",
    city: "Accra",
    bio: "Sculptor and installation artist transforming recycled urban materials into monuments of African resilience. Based in Accra, exhibiting globally.",
    categories: ["Sculptor", "Performer"],
    whatsapp: "+233500000002",
    email: "kwame@ganahub.com",
    socialLinks: { instagram: "@kwame.asante" },
    interests: ["Physical exhibitions", "Festivals", "Workshops", "Collaborations"],
    featured: true,
    followerCount: 5123,
    artworkCount: 18,
  },
  {
    id: "a3",
    fullName: "Zara Osei-Bonsu",
    stageName: "ZaraOsei",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    country: "Uganda",
    city: "Entebbe",
    bio: "Fashion designer blending Kitenge and Ankara textiles with haute couture. Creating wearable art that celebrates African womanhood.",
    categories: ["Fashion Designer", "Cultural Creative"],
    whatsapp: "+256700000003",
    email: "zara@ganahub.com",
    socialLinks: { instagram: "@zaraosei_design", twitter: "@zaraoseidesign" },
    interests: ["Marketplace selling", "Festivals", "Collaborations"],
    featured: false,
    followerCount: 1256,
    artworkCount: 52,
  },
  {
    id: "a4",
    fullName: "Seun Adebayo",
    stageName: "SeunArt",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    country: "Nigeria",
    city: "Lagos",
    bio: "Digital artist and NFT pioneer merging Yoruba iconography with generative algorithms. Teaching the ancestors to speak in code.",
    categories: ["Digital Artist", "Photographer"],
    whatsapp: "+234800000004",
    email: "seun@ganahub.com",
    website: "https://seunart.io",
    socialLinks: { instagram: "@seun.art", twitter: "@seunart_nft" },
    interests: ["Virtual exhibitions", "Marketplace selling", "International opportunities", "AR/immersive exhibitions"],
    featured: true,
    followerCount: 9340,
    artworkCount: 78,
  },
  {
    id: "a5",
    fullName: "Fatima Diallo",
    stageName: "FatimaD",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    country: "Senegal",
    city: "Dakar",
    bio: "Documentary filmmaker and photographer capturing the pulse of West Africa's creative renaissance. Visual stories that refuse to be silenced.",
    categories: ["Filmmaker", "Photographer"],
    whatsapp: "+221700000005",
    email: "fatima@ganahub.com",
    socialLinks: { instagram: "@fatima.diallo.films", facebook: "FatimaDFilms" },
    interests: ["Physical exhibitions", "Virtual exhibitions", "Workshops"],
    featured: false,
    followerCount: 3670,
    artworkCount: 41,
  },
];

export const SAMPLE_ARTWORKS: Artwork[] = [
  {
    id: "w1",
    artistId: "a1",
    artistName: "AmaraNaki",
    title: "Nyange wa Kupenda",
    description: "A meditation on love as expressed through Ugandan lake mythology. The painting channels the spirit of the crested crane in flight — freedom, grace, and ancestral memory.",
    category: "Painting",
    dimensions: "120cm × 90cm",
    price: 1800000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
    tags: ["mythology", "Uganda", "crested crane", "oil paint"],
    year: 2024,
    sold: false,
  },
  {
    id: "w2",
    artistId: "a1",
    artistName: "AmaraNaki",
    title: "Kampala Rising",
    description: "The city as organism — a living, breathing entity of ambition and contradiction. Layers of acrylic and collage map the emotional terrain of urban Ugandan identity.",
    category: "Mixed Media",
    dimensions: "150cm × 100cm",
    price: 2400000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600",
    tags: ["Kampala", "urban", "identity", "mixed media"],
    year: 2024,
    sold: false,
  },
  {
    id: "w3",
    artistId: "a2",
    artistName: "KwameAsante",
    title: "Sankofa Monument",
    description: "Recycled aluminium and copper sculpture standing 2m tall. Inspired by the Akan Sankofa bird — to move forward, we must look back.",
    category: "Sculpture",
    dimensions: "200cm H × 80cm W",
    price: 8500000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600",
    tags: ["Sankofa", "Ghana", "recycled", "bronze", "Akan"],
    year: 2023,
    sold: false,
  },
  {
    id: "w4",
    artistId: "a4",
    artistName: "SeunArt",
    title: "Orisha Digital",
    description: "A generative digital artwork translating Yoruba Orisha iconography into algorithmic landscapes. Each print is unique — edition of 7.",
    category: "Digital Art",
    dimensions: "A2 archival print",
    price: 950000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=600",
    tags: ["Yoruba", "generative", "Orisha", "digital", "NFT"],
    year: 2025,
    sold: false,
  },
  {
    id: "w5",
    artistId: "a3",
    artistName: "ZaraOsei",
    title: "Adinkra Couture No. 3",
    description: "Hand-stitched silk garment featuring embroidered Adinkra symbols. A statement piece merging Ghanaian textile heritage with contemporary fashion architecture.",
    category: "Fashion",
    dimensions: "Custom sizing available",
    price: 3200000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    tags: ["Adinkra", "fashion", "silk", "Ghana", "couture"],
    year: 2025,
    sold: false,
  },
  {
    id: "w6",
    artistId: "a5",
    artistName: "FatimaD",
    title: "Dakar After Midnight",
    description: "Large format photographic print capturing the surreal energy of Dakar's creative underground. Archival pigment on metallic paper.",
    category: "Photography",
    dimensions: "100cm × 70cm",
    price: 1200000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    tags: ["Dakar", "photography", "nightlife", "documentary"],
    year: 2024,
    sold: true,
  },
  {
    id: "w7",
    artistId: "a4",
    artistName: "SeunArt",
    title: "Lagos Frequency",
    description: "Audio-visual digital installation concept. This limited edition print captures one frame from the 24-hour generative audio-visual Lagos soundscape project.",
    category: "Digital Art",
    dimensions: "60cm × 60cm print",
    price: 650000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1493552832879-9a8f19e1ec2c?w=600",
    tags: ["Lagos", "audio-visual", "digital", "generative"],
    year: 2025,
    sold: false,
  },
  {
    id: "w8",
    artistId: "a2",
    artistName: "KwameAsante",
    title: "Ubuntu Table",
    description: "Functional sculpture — a dining table crafted from salvaged iroko wood and bronze inlay. 'I am because we are' carved in 14 African languages.",
    category: "Sculpture",
    dimensions: "240cm × 90cm × 75cm",
    price: 12000000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    tags: ["Ubuntu", "furniture", "iroko", "bronze", "functional art"],
    year: 2023,
    sold: false,
  },
];

export const SAMPLE_MEDIA: MediaTrack[] = [
  {
    id: "m1",
    title: "Amara Talks: The Mythology of Form",
    artist: "AmaraNaki",
    duration: "12:34",
    durationSeconds: 754,
    coverImage: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400",
    type: "audio",
    description: "Artist Amara Nakimuli discusses the spiritual dimensions of her painting practice and how Ugandan folklore informs her compositional choices.",
    category: "Artist Story",
  },
  {
    id: "m2",
    title: "GANA Gallery Opening Night",
    artist: "GANA HUB",
    duration: "8:21",
    durationSeconds: 501,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    type: "video",
    description: "Full highlights from the GANA Gallery inaugural opening in Kampala. Artists, collectors, and creative professionals converge.",
    category: "Exhibition",
  },
  {
    id: "m3",
    title: "Kwame in the Studio: Sankofa Process",
    artist: "KwameAsante",
    duration: "18:47",
    durationSeconds: 1127,
    coverImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400",
    type: "audio",
    description: "An intimate studio visit with sculptor Kwame Asante as he fabricates the Sankofa Monument over four months.",
    category: "Artist Story",
  },
  {
    id: "m4",
    title: "AfroFuturism & African Art — Panel Discussion",
    artist: "GANA HUB",
    duration: "45:12",
    durationSeconds: 2712,
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    type: "audio",
    description: "Five African artists in conversation about Afrofuturism, digital art, and the future of African creative ecosystems.",
    category: "Panel",
  },
  {
    id: "m5",
    title: "Festival Preview: GANA ArtFest 2025",
    artist: "GANA HUB",
    duration: "3:45",
    durationSeconds: 225,
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    type: "video",
    description: "Official preview reel for the GANA ArtFest 2025 — three days of exhibitions, performances, workshops, and cultural exchange.",
    category: "Festival",
  },
];

export const SAMPLE_EVENTS: Event[] = [
  {
    id: "e1",
    title: "GANA ArtFest 2025",
    type: "Festival",
    location: "Kampala Serena Conference Centre",
    city: "Kampala, Uganda",
    description: "Three days of immersive African art, music, and cultural exchange. 40+ artists, 20 workshops, virtual exhibition, and a closing gala celebration.",
    startDate: "2025-09-12",
    endDate: "2025-09-14",
    price: 150000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    artistCount: 42,
    capacity: 800,
    spotsLeft: 234,
  },
  {
    id: "e2",
    title: "Living Art: AR Exhibition",
    type: "Exhibition",
    location: "GANA Gallery Kampala",
    city: "Kampala, Uganda",
    description: "Scan artworks with your phone to unlock animated stories, artist interviews, and soundscapes. The first WebAR art exhibition in East Africa.",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    price: 50000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600",
    artistCount: 12,
    capacity: 200,
    spotsLeft: 67,
  },
  {
    id: "e3",
    title: "Digital Art Masterclass with SeunArt",
    type: "Workshop",
    location: "Online via Zoom",
    city: "Remote",
    description: "Two-day intensive workshop on generative art, AI tools, and NFT creation for African digital artists. Limited to 30 participants.",
    startDate: "2025-06-20",
    endDate: "2025-06-21",
    price: 280000,
    currency: "UGX",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600",
    artistCount: 1,
    capacity: 30,
    spotsLeft: 8,
  },
];

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    userId: "u1",
    artworkId: "w1",
    amount: 1800000,
    currency: "UGX",
    paymentMethod: "mtn_momo",
    network: "MTN Uganda",
    status: "completed",
    phoneNumber: "+256700000001",
    reference: "GANA-2025-001",
    createdAt: "2025-05-10T14:23:00Z",
    description: "Purchase: Nyange wa Kupenda",
  },
  {
    id: "t2",
    userId: "u2",
    amount: 150000,
    currency: "UGX",
    paymentMethod: "airtel_money",
    network: "Airtel Uganda",
    status: "completed",
    phoneNumber: "+256750000002",
    reference: "GANA-2025-002",
    createdAt: "2025-05-11T09:15:00Z",
    description: "Festival Ticket: GANA ArtFest 2025",
  },
  {
    id: "t3",
    userId: "u3",
    artworkId: "w4",
    amount: 950000,
    currency: "UGX",
    paymentMethod: "mtn_momo",
    network: "MTN Uganda",
    status: "failed",
    phoneNumber: "+256700000003",
    reference: "GANA-2025-003",
    createdAt: "2025-05-12T16:45:00Z",
    description: "Purchase: Orisha Digital",
  },
];

export const ARTWORK_CATEGORIES = [
  "All", "Painting", "Sculpture", "Digital Art", "Photography", "Fashion", "Mixed Media", "Drawing",
];

export const ARTIST_CATEGORIES = [
  "All", "Painter", "Sculptor", "Musician", "Fashion Designer", "Digital Artist",
  "Photographer", "Filmmaker", "Performer", "Cultural Creative", "Curator", "Other",
];

export const formatUGX = (amount: number): string => {
  if (amount >= 1000000) return `UGX ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `UGX ${(amount / 1000).toFixed(0)}K`;
  return `UGX ${amount.toLocaleString()}`;
};
