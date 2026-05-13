/**
 * GANA HUB — Firebase / Firestore Schema
 *
 * This file documents the Firestore collection structure and
 * provides TypeScript interfaces for all database entities.
 *
 * SETUP:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable: Authentication, Firestore, Storage, Hosting
 * 3. Add Firebase config to environment variables (see below)
 * 4. Install: pnpm add firebase
 *
 * ENVIRONMENT VARIABLES (set in .env / Replit Secrets):
 *   EXPO_PUBLIC_FIREBASE_API_KEY
 *   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   EXPO_PUBLIC_FIREBASE_PROJECT_ID
 *   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   EXPO_PUBLIC_FIREBASE_APP_ID
 *
 * FIRESTORE SECURITY RULES:
 * See firestore.rules file in project root.
 * Key rules:
 *   - users: read=authenticated, write=owner only
 *   - artworks: read=public, write=artist owner
 *   - transactions: read=owner, write=server (Firebase Functions)
 *   - artists: read=public, write=artist owner + admin
 */

// ============================================================
// FIRESTORE COLLECTIONS
// ============================================================

export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  profileImage?: string;
  role: "user" | "artist" | "admin";
  createdAt: string;
}

export interface FirestoreArtist {
  artistId: string;
  uid: string;
  fullName: string;
  stageName: string;
  profileImage?: string;
  country: string;
  city: string;
  bio: string;
  categories: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  whatsapp: string;
  email: string;
  website?: string;
  interests: string[];
  featured: boolean;
  verified: boolean;
  followerCount: number;
  artworkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreArtwork {
  artworkId: string;
  artistId: string;
  title: string;
  description: string;
  category: string;
  dimensions: string;
  price: number;
  currency: string;
  imageUrls: string[];
  thumbnailUrl: string;
  tags: string[];
  year: number;
  sold: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreTransaction {
  transactionId: string;
  userId: string;
  artworkId?: string;
  eventId?: string;
  artistId?: string;
  amount: number;
  currency: string;
  paymentMethod: "mtn_momo" | "airtel_money" | "card" | "paypal";
  network: string;
  status: "pending" | "completed" | "failed" | "refunded";
  phoneNumber: string;
  reference: string;
  providerTransactionId?: string;
  description: string;
  webhookVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreOrder {
  orderId: string;
  artworkId: string;
  buyerId: string;
  sellerId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: {
    line1: string;
    city: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreFestivalTicket {
  ticketId: string;
  eventId: string;
  buyerId: string;
  amount: number;
  currency: string;
  transactionId: string;
  paymentStatus: "pending" | "paid" | "cancelled";
  qrCode: string;
  scanned: boolean;
  createdAt: string;
}

export interface FirestoreArtistApplication {
  applicationId: string;
  artistId: string;
  eventId: string;
  eventType: "festival" | "exhibition" | "workshop" | "marketplace";
  message: string;
  portfolioUrls: string[];
  applicationStatus: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreCommunication {
  communicationId: string;
  title: string;
  audienceCategory: string[];
  audienceCountries: string[];
  message: string;
  type: "email" | "push" | "whatsapp";
  status: "draft" | "sent";
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface FirestoreMediaItem {
  mediaId: string;
  title: string;
  artist: string;
  artistId?: string;
  type: "audio" | "video";
  storageUrl: string;
  coverImageUrl: string;
  duration: number;
  category: string;
  description: string;
  playCount: number;
  featured: boolean;
  createdAt: string;
}

// ============================================================
// FIREBASE INITIALIZATION (activate when Firebase is integrated)
// ============================================================

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
//
// const firebaseConfig = {
//   apiKey: process.env["EXPO_PUBLIC_FIREBASE_API_KEY"],
//   authDomain: process.env["EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"],
//   projectId: process.env["EXPO_PUBLIC_FIREBASE_PROJECT_ID"],
//   storageBucket: process.env["EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"],
//   messagingSenderId: process.env["EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
//   appId: process.env["EXPO_PUBLIC_FIREBASE_APP_ID"],
// };
//
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
