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
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Spectrum of Identity",
    description: "A bold and vivid portrait exploring the multiplicity of African identity. Explosive colour — golds, teals, reds — erupt from a dark background around a woman's face, representing the many dimensions of self that live within a single soul. Acrylic on canvas.",
    category: "Painting",
    dimensions: "90cm × 120cm",
    price: 2800000,
    currency: "UGX",
    imageUrl: "",
    tags: ["portrait", "identity", "colourful", "acrylic", "African woman"],
    year: 2025,
    sold: false,
  },
  {
    id: "w2",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Reflection at Dusk",
    description: "A majestic giraffe bends to drink from a still watering hole as the African sky roils with storm clouds. The mirror-perfect reflection below transforms the painting into a meditation on stillness, dignity, and the symmetry found in nature. Oil on canvas.",
    category: "Painting",
    dimensions: "70cm × 100cm",
    price: 3500000,
    currency: "UGX",
    imageUrl: "",
    tags: ["giraffe", "wildlife", "savanna", "reflection", "oil paint"],
    year: 2024,
    sold: false,
  },
  {
    id: "w3",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Heritage Hands",
    description: "Two Maasai children — one bearing traditional face markings, the other gazing with quiet curiosity — are captured mid-moment in an act of play and protection. The raw texture of the canvas and earthy palette honours the depth of East African tribal heritage. Oil on canvas.",
    category: "Painting",
    dimensions: "80cm × 110cm",
    price: 4200000,
    currency: "UGX",
    imageUrl: "",
    tags: ["Maasai", "children", "tribal", "East Africa", "heritage"],
    year: 2025,
    sold: false,
  },
  {
    id: "w4",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Guardian of the Ancient",
    description: "A young African girl in traditional dress presses her cheek tenderly against the wrinkled trunk of a great white elephant. The painting speaks of guardianship — of land, memory, and the covenant between humanity and nature that African cultures have held for millennia. Acrylic on canvas.",
    category: "Painting",
    dimensions: "90cm × 115cm",
    price: 5800000,
    currency: "UGX",
    imageUrl: "",
    tags: ["elephant", "child", "nature", "guardian", "African culture"],
    year: 2024,
    sold: false,
  },
  {
    id: "w5",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Urban Primate",
    description: "A chimpanzee decked in oversized headphones, reflective shades, and a cap leans back with unmistakable swagger. Equal parts satirical and celebratory, this mixed media work asks who is watching whom — and who truly controls the culture. Acrylic and spray on board.",
    category: "Mixed Media",
    dimensions: "60cm × 80cm",
    price: 1900000,
    currency: "UGX",
    imageUrl: "",
    tags: ["chimp", "pop art", "street art", "culture", "music"],
    year: 2025,
    sold: false,
  },
  {
    id: "w6",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Titan in Colour",
    description: "An African elephant fills the entire canvas in a blaze of orange, gold, and cobalt. Brushstrokes of raw paint collide and drip, creating a living texture that pulses with energy. This is the continent itself — vast, ancient, and impossible to contain. Acrylic on canvas.",
    category: "Painting",
    dimensions: "100cm × 130cm",
    price: 6500000,
    currency: "UGX",
    imageUrl: "",
    tags: ["elephant", "bold", "colourful", "acrylic", "Africa"],
    year: 2024,
    sold: false,
  },
  {
    id: "w7",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Songs of the Motherland",
    description: "Three African women — mouths open wide in joyful song — are rendered in warm amber and terracotta against a golden textured ground. Their laughter is a sound that needs no translation, a universal language of life and belonging. Oil on textured canvas.",
    category: "Painting",
    dimensions: "70cm × 90cm",
    price: 3200000,
    currency: "UGX",
    imageUrl: "",
    tags: ["women", "joy", "song", "community", "warm tones"],
    year: 2025,
    sold: false,
  },
  {
    id: "w8",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "First Love",
    description: "A mother giraffe and her calf stand head-to-head against an autumnal savanna sky, their spotted coats merging in a shared gesture of tenderness. The work is a quiet celebration of maternal bonds — those first lessons of love that shape every living creature. Oil on canvas.",
    category: "Painting",
    dimensions: "75cm × 100cm",
    price: 3800000,
    currency: "UGX",
    imageUrl: "",
    tags: ["giraffe", "mother", "calf", "wildlife", "tender"],
    year: 2024,
    sold: false,
  },
  {
    id: "w9",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "See No Evil",
    description: "Three chimpanzees enact the ancient proverb — see no evil, hear no evil, speak no evil — rendered in muted charcoal greens and greys with hyperrealistic precision. A wry commentary on complicity and conscience in the modern age. Acrylic on canvas.",
    category: "Painting",
    dimensions: "90cm × 60cm",
    price: 2500000,
    currency: "UGX",
    imageUrl: "",
    tags: ["chimpanzee", "proverb", "realism", "philosophy", "nature"],
    year: 2024,
    sold: false,
  },
  {
    id: "w10",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Warrior Grace",
    description: "A Maasai woman adorned with layers of beaded jewellery and ceremonial headwear stares directly out of the canvas. Rendered entirely in black, white, and grey against a geometric patterned ground, her presence is monumental — fierce strength distilled into absolute stillness. Acrylic on canvas.",
    category: "Painting",
    dimensions: "80cm × 100cm",
    price: 4500000,
    currency: "UGX",
    imageUrl: "",
    tags: ["Maasai", "portrait", "monochrome", "beads", "warrior"],
    year: 2025,
    sold: false,
  },
  {
    id: "w11",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Cosmic Ascension",
    description: "An African man gazes upward, his dark features dissolving into a swirling cosmos of stone circles, emerald greens, and cobalt blues. The piece fuses African spirituality with afrofuturism — the ancestor who becomes the star. Mixed media on board.",
    category: "Mixed Media",
    dimensions: "50cm × 90cm",
    price: 3100000,
    currency: "UGX",
    imageUrl: "",
    tags: ["abstract", "afrofuturism", "cosmos", "spiritual", "portrait"],
    year: 2025,
    sold: false,
  },
  {
    id: "w12",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Circles of Tradition",
    description: "A young Maasai girl smiles serenely, her skin and clothing overlaid with intricate geometric patterns — circles and crosses that reference traditional textile and body art. The grayscale palette forces the eye to rest entirely on form, pattern, and expression. Acrylic on canvas.",
    category: "Painting",
    dimensions: "80cm × 80cm",
    price: 3900000,
    currency: "UGX",
    imageUrl: "",
    tags: ["Maasai", "girl", "monochrome", "pattern", "tradition"],
    year: 2024,
    sold: false,
  },
  {
    id: "w13",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Bloom",
    description: "In profile, a young African woman with a halo of natural curls glances downward at a bouquet of red tulips. The warm glow behind her — ochre fading to sky blue — bathes the composition in the feeling of a golden afternoon. A quiet ode to beauty, growth, and grace. Oil on canvas.",
    category: "Painting",
    dimensions: "85cm × 85cm",
    price: 3400000,
    currency: "UGX",
    imageUrl: "",
    tags: ["portrait", "flowers", "profile", "woman", "natural beauty"],
    year: 2025,
    sold: false,
  },
  {
    id: "w14",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Rage and Resilience",
    description: "An elephant surges forward through a storm of crimson paint, its body fragmenting into architectural lines and abstract marks. The work captures the raw tension between destruction and endurance — the elephant as symbol of African resilience in the face of relentless pressure. Acrylic and mixed media on canvas.",
    category: "Mixed Media",
    dimensions: "120cm × 80cm",
    price: 5200000,
    currency: "UGX",
    imageUrl: "",
    tags: ["elephant", "abstract", "red", "power", "resilience"],
    year: 2024,
    sold: false,
  },
  {
    id: "w15",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Still Waters",
    description: "A lone elephant stands at the edge of a forest waterhole at golden hour, its perfect reflection mirrored in the glassy surface below. Dense green trees frame the scene in tranquillity. This painting rewards patience — the longer you look, the more you find. Oil on canvas.",
    category: "Painting",
    dimensions: "90cm × 110cm",
    price: 4800000,
    currency: "UGX",
    imageUrl: "",
    tags: ["elephant", "waterhole", "reflection", "forest", "serenity"],
    year: 2024,
    sold: false,
  },
  {
    id: "w16",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Abundance",
    description: "Nine koi fish in vivid reds, oranges, golds, and whites move in a swirling dance across a deep cobalt ground. Though koi originate in East Asia, their symbolism — prosperity, perseverance, luck — resonates deeply with pan-African celebrations of abundance and community. Acrylic on canvas.",
    category: "Painting",
    dimensions: "60cm × 90cm",
    price: 2200000,
    currency: "UGX",
    imageUrl: "",
    tags: ["koi", "fish", "abundance", "colour", "prosperity"],
    year: 2025,
    sold: false,
  },
  {
    id: "w17",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "King's Walk",
    description: "A tall African man in a flowing crimson garment stands behind a great male lion, both gazing forward with calm authority. The background dissolves into bright splashes of teal, yellow, and green — the continent alive with possibility. The king and his lion: equals. Acrylic on canvas.",
    category: "Painting",
    dimensions: "80cm × 120cm",
    price: 6200000,
    currency: "UGX",
    imageUrl: "",
    tags: ["lion", "man", "king", "power", "colourful"],
    year: 2026,
    sold: false,
  },
  {
    id: "w18",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Saffron Queen",
    description: "An African woman in a deep saffron orange turban and dress is rendered in extraordinary detail against a field of electric teal and indigo brushstrokes. The warm/cool contrast vibrates off the canvas. A portrait of total confidence — a queen who needs no crown. Oil on canvas.",
    category: "Painting",
    dimensions: "75cm × 90cm",
    price: 5500000,
    currency: "UGX",
    imageUrl: "",
    tags: ["portrait", "woman", "orange", "teal", "regal"],
    year: 2026,
    sold: false,
  },
  {
    id: "w19",
    artistId: "gallery",
    artistName: "GANA Gallery",
    title: "Matriarch",
    description: "Three elephants — a great matriarch flanked by two younger relatives — advance across the canvas in a blaze of electric blue, gold, and orange light. Their tusks gleam, their bodies glow. This is family, lineage, and the unstoppable force of love passed through generations. Acrylic on canvas.",
    category: "Painting",
    dimensions: "110cm × 70cm",
    price: 7000000,
    currency: "UGX",
    imageUrl: "",
    tags: ["elephants", "family", "matriarch", "bold", "African wildlife"],
    year: 2026,
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
