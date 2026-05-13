# GANA HUB

African Creative Ecosystem — mobile-first platform connecting African artists, collectors, and cultural storytellers through digital commerce, immersive experiences, and community.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo / React Native (SDK 54)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/` — Expo mobile app (main product)
- `artifacts/mobile/app/` — Expo Router screens
- `artifacts/mobile/app/(tabs)/` — 5 main tabs (Home, Gallery, Artists, Media, More)
- `artifacts/mobile/components/` — Shared UI components
- `artifacts/mobile/context/` — React context providers (Auth, Player, Cart)
- `artifacts/mobile/services/` — Payment and AI service architecture
- `artifacts/mobile/constants/colors.ts` — Afro-futuristic dark gold palette
- `artifacts/mobile/constants/sampleData.ts` — Sample artists, artworks, events, media
- `artifacts/api-server/src/routes/` — Express API routes
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth
- `lib/db/src/schema/` — Drizzle ORM database schema

## Architecture decisions

- Afro-futuristic dark luxury palette: deep black (#0A0A0A) + gold (#D4AF37) + bronze (#C08A2E)
- Payment architecture uses MTN MoMo + Airtel Money with server-side API key handling
- Firebase-ready: all Firestore schemas typed and documented in `services/firebaseSchema.ts`
- Media player is context-based (PlayerContext) with a persistent mini-bar across all tabs
- AR (Living Art) uses MindAR placeholder architecture — camera scanning UI is fully built
- AI service architecture prepared for OpenAI API proxy via backend

## Product

**GANA HUB sub-platforms:**
1. GANA Gallery — Artwork marketplace (searchable, filterable grid + list views)
2. GANA Living Art — WebAR artwork scanning with MindAR integration architecture
3. Virtual Gallery — Immersive scrollable gallery (in Gallery tab)
4. Artist Marketplace — Buy/sell original African artworks
5. Festival & Exhibition Hub — Events, workshops, ticket purchasing
6. Media Player — Audio/video artist stories and exhibition content
7. Artist Database — Searchable directory with country/category filters + registration

**Payment flows:** MTN Mobile Money + Airtel Money Uganda, with architecture ready for Visa/Mastercard, PayPal, Stripe

## User preferences

- Dark Afro-futuristic aesthetic: black + gold + bronze palette
- Mobile-first, no desktop-first compromises
- No emojis in UI
- All API keys via environment variables — never hardcoded

## Gotchas

- Payment API calls MUST go through backend (Firebase Functions or Express) — never client-side
- MTN and Airtel API keys configured as: MTN_API_KEY, MTN_API_SECRET, AIRTEL_API_KEY, AIRTEL_API_SECRET
- Firebase keys use EXPO_PUBLIC_ prefix: EXPO_PUBLIC_FIREBASE_API_KEY, etc.
- expo-system-ui sets the background to #0A0A0A before content renders

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Payment service architecture: `services/paymentService.ts` (orchestration), `services/mtnMomoService.ts`, `services/airtelMoneyService.ts`
- Firebase schema: `services/firebaseSchema.ts`
- AI service stubs: `services/aiService.ts`
