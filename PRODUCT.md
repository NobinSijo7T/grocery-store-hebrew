# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Israeli home shoppers — families and busy professionals — ordering fresh groceries for home delivery. A secondary role is the store owner / staff managing inventory, orders, and fulfilment via an in-app admin panel.

## Product Purpose

משק קירשנר (Mishek Kirshner) is a local farm-and-grocery brand delivering fresh produce and grocery items directly to Israeli homes. The app lets customers browse, favourite, and order fresh products with same-day or next-day delivery; it also gives store staff a dedicated admin panel to process orders and manage inventory in real time.

## Positioning

A named local farm brand with a direct-to-consumer channel — not an anonymous marketplace. Customers shop from a known, trusted source with a Hebrew-first experience built for the Israeli market.

## Operating Context

- RTL layout throughout (Hebrew primary, English secondary with a bilingual toggle)
- Israeli market: prices in ₪ (NIS), local delivery slots, Hebrew product names and categories
- Mobile-first: React Native / Expo targeting iOS and Android (adaptive design language)
- Supabase backend with real-time order status updates
- Two user roles: `customer` (shop and track) and `admin`/`staff` (manage orders and inventory)

## Capabilities and Constraints

- Customer features: browse products by category, search, favourites, cart, checkout with address, real-time order tracking
- Admin features: order management with status updates, product stock/active toggling, dashboard overview
- Authentication: email/password via Supabase Auth; role stored in `customers.role`
- Delivery fee waived above ₪150 threshold; configurable constants in `env.ts`
- Platform: Expo SDK 57, React Native 0.86, React 19; Expo Router for navigation
- Realtime: Supabase Realtime on `orders`, `deliveries`, `cart_items` tables

## Brand Commitments

- Name: **משק קירשנר** (Mishek Kirshner)
- Hebrew-first UI; all customer-facing copy is in Hebrew
- Heebo typeface family (Regular, Medium, SemiBold, Bold, Black) — loaded from GitHub
- Brand primary colour: `#208AEF` (confirmed in splash screen config)

## Evidence on Hand

- Full Supabase schema: `supabase/migrations/001_create_tables.sql`
- Seed data (categories, products, banners, offers): `supabase/migrations/003_seed_data.sql`
- Hebrew and English copy constants: `src/constants/hebrew.ts`, `src/constants/english.ts`
- Theme tokens (light + dark): `src/constants/theme.ts`
- No external logo or brand asset files present in the repository yet

## Product Principles

1. **Local and trustworthy** — every screen should feel like shopping from a known neighbour, not a faceless platform.
2. **Hebrew-first, friction-free** — RTL layout, clear Hebrew copy, and minimal tap-count from browse to order.
3. **Fresh and fast** — speed of delivery is the core promise; the UI should reinforce urgency and freshness.
4. **Staff-ready** — the admin panel is a real working tool, not an afterthought; clarity and efficiency matter as much as in the customer flow.
5. **Reliable on mobile** — graceful loading states, offline-aware feedback, and native-feeling interactions on both iOS and Android.

## Accessibility & Inclusion

- RTL support via `I18nManager.forceRTL` in the root layout
- Bilingual toggle (Hebrew / English) available in-app
