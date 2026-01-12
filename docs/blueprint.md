# Maison Aurèle – Editorial-First Blueprint

## 0. Current Implementation Snapshot (Jan 2026)

### Implemented UI & UX
- **Dual navbar system**: primary site header for editorial pages, and a dedicated **ShopNavbar** for shop + PDP. ShopNavbar includes menu, search, wishlist, and cart drawers with scroll-hide/show behavior.
- **Product detail (PDP)**: Dior-style split view with multi-image left gallery, sticky right rail, and concierge-focused CTAs.
- **Variant UX**: variants live inside the **“Size & Shades”** tab; selection highlights one variant and exposes a single **Add to Cart** button.
- **Silhouette + Similar**: full-screen silhouette hero + curated companion pieces; “Similar” grid with editorial cards.
- **Hover swap**: product tiles and silhouette items swap to the next image on hover for luxury-grade motion.
- **Scroll polish**: reveal animations on PDP mid/low sections (atelier, care, silhouette, similar).
- **Cart drawer**: body scroll lock + overscroll containment to avoid jitter.

### In-Progress / Next Targets
- **Auth/Account**: complete luxury sign-in/sign-up flows and sync cart/wishlist per user.
- **Search + Filters**: connect advanced filters/sorting to server actions for catalog scale.
- **Checkout flow**: verify webhook-driven order creation and order history in account.
- **Responsive QA**: validate PDP/ShopNavbar behavior on tablet + mobile breakpoints.

## 1. Information Architecture & Sitemap (FR + EN)

Maison Aurèle leads with cinematic editorial narratives, so the sitemap is structured around chapters that seamlessly route into commerce flows. Every public-facing page must support both English (`/en`) and French (`/fr`) locales with shared slugs and localized metadata.

### Public Experience

1. **Home / Atelier Chronicle**  
   - Hero: immersive video, bilingual minimal copy toggle.  
   - Scroll story sections: Craft, Fabric Origins, Collection Spotlight, Maison Heritage, Journal Teaser, Appointment CTA.  
   - Dynamic modules (CMS-driven) arranged per locale.
2. **Journal**  
   - `/[locale]/journal` (index with featured essays, films, lookbooks).  
   - `/[locale]/journal/[slug]` (article with bilingual body, embedded commerce cards).
3. **Collections**  
   - Index: gallery of current and archival capsules with hover storytelling.  
   - Detail: vertical narrative (inspiration, lookbook carousel, product grid, limited-drop timer).
4. **Products**  
   - Listing `/[locale]/boutique`: filters (category, material, atelier tag, availability, limited edition).  
   - PDP `/[locale]/boutique/[slug]`: macro gallery, craft notes, personalization, size guide, related editorial references.
5. **Maison**  
   - Brand story with timeline, atelier map, heritage films, sustainability chapter.
6. **Stores & Appointments**  
   - Flagship showcase, atelier tour booking, concierge contact, localized hours.
7. **Limited Drops**  
   - Countdown, waitlist enrollment, editorial context for capsule releases.
8. **Account**  
   - Auth gateway, profile, addresses, orders, services (white-glove, certificates).
9. **Cart & Checkout**  
   - Persistent mini-cart, full cart page, Stripe checkout handoff, order confirmation.

### Internal/Admin Experience

1. **Dashboard Overview** – KPIs (sales, drop waitlists, appointments).  
2. **Content & Editorial** – Journal posts, homepage modules, hero scenes per locale.  
3. **Collections & Products** – CRUD for collections, products, variants, media, storytelling fields.  
4. **Commerce Ops** – Orders, customers, promotions, inventory, limited-drop controls.  
5. **Services** – Appointment management, personalization requests, certificates.  
6. **Settings** – Locales, SEO defaults, asset management, integrations (Stripe, Cloudinary, Mux).

### Localization Considerations

- Route groups for `/(fr)` and `/(en)` under `app/(store)/`.  
- Shared CMS entries with language variants; fallback rules when a translation is missing.  
- Locale-aware metadata (OpenGraph, structured data) and copy tokens.  
- Admin views default to English but surface per-locale content editing.

## 2. Prisma Schema (Luxury Editorial + Commerce)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Locale {
  EN
  FR
}

enum UserRole {
  CUSTOMER
  EDITOR
  MERCHANDISER
  ADMIN
}

enum ProductStatus {
  DRAFT
  PREORDER
  ACTIVE
  ARCHIVED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  FULFILLED
  CANCELLED
  REFUNDED
}

enum FulfillmentStatus {
  NOT_STARTED
  IN_PROGRESS
  SHIPPED
  DELIVERED
  WHITE_GLOVE_SCHEDULED
}

enum PaymentStatus {
  UNPAID
  AUTHORIZED
  PAID
  REFUNDED
}

enum Currency {
  EUR
  USD
}

enum MediaType {
  IMAGE
  VIDEO
}

enum EditorialCategory {
  COLLECTION
  JOURNAL
  MAISON
  CAMPAIGN
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  passwordHash  String?
  firstName     String?
  lastName      String?
  role          UserRole   @default(CUSTOMER)
  locale        Locale     @default(EN)
  phone         String?
  marketingOptIn Boolean   @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  accounts      Account[]
  sessions      Session[]
  addresses     Address[]
  carts         Cart[]
  orders        Order[]
  appointments  Appointment[]
  personalizationRequests PersonalizationRequest[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Address {
  id           String   @id @default(cuid())
  label        String?
  firstName    String
  lastName     String
  line1        String
  line2        String?
  city         String
  region       String?
  postalCode   String
  country      String    @default("FR")
  phone        String?
  isDefault    Boolean   @default(false)
  userId       String?
  user         User?     @relation(fields: [userId], references: [id])
  ordersShipping Order[] @relation("OrderShipping")
  ordersBilling  Order[] @relation("OrderBilling")
}

model Category {
  id            String              @id @default(cuid())
  slug          String              @unique
  parentId      String?
  parent        Category?           @relation("CategoryChildren", fields: [parentId], references: [id])
  children      Category[]          @relation("CategoryChildren")
  translations  CategoryTranslation[]
  products      Product[]
}

model CategoryTranslation {
  id          String   @id @default(cuid())
  title       String
  description String?
  locale      Locale
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([categoryId, locale])
}

model Material {
  id          String   @id @default(cuid())
  name        String
  origin      String?
  sustainabilityNotes String?
  products    ProductMaterial[]
}

model Product {
  id               String              @id @default(cuid())
  slug             String              @unique
  skuPrefix        String?
  status           ProductStatus       @default(DRAFT)
  originCountry    String?             @default("FR")
  atelierNotes     String?
  limitedEdition   Boolean             @default(false)
  dropDate         DateTime?
  heritageTag      String?
  careInstructions Json?
  seoMeta          Json?
  weightGrams      Int?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt
  categoryId       String?
  category         Category?           @relation(fields: [categoryId], references: [id])
  translations     ProductTranslation[]
  materials        ProductMaterial[]
  variants         ProductVariant[]
  media            ProductMedia[]
  collections      CollectionItem[]
  spotlightModules ProductSpotlightModule[]
  waitlistEntries  WaitlistEntry[]
  editorialFeatures EditorialFeature[]
}

model ProductTranslation {
  id           String   @id @default(cuid())
  locale       Locale
  name         String
  description  String?
  craftStory   String?
  materialsText String?
  sizeGuide    String?
  seoTitle     String?
  seoDescription String?
  productId    String
  product      Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, locale])
}

model ProductVariant {
  id           String     @id @default(cuid())
  sku          String     @unique
  productId    String
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  color        String
  size         String?
  materialMix  String?
  priceCents   Int
  compareAtCents Int?
  currency     Currency   @default(EUR)
  availableFrom DateTime?
  personalizationAllowed Boolean @default(false)
  weightGrams  Int?
  inventory    Inventory?
  cartItems    CartItem[]
  orderItems   OrderItem[]
  media        ProductVariantMedia[]
}

model Inventory {
  id             String   @id @default(cuid())
  variantId      String   @unique
  variant        ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  quantity       Int      @default(0)
  reserved       Int      @default(0)
  lowStockThreshold Int   @default(2)
  adjustments    InventoryAdjustment[]
}

model InventoryAdjustment {
  id          String   @id @default(cuid())
  inventoryId String
  inventory   Inventory @relation(fields: [inventoryId], references: [id], onDelete: Cascade)
  change      Int
  reason      String?
  createdAt   DateTime  @default(now())
}

model ProductMaterial {
  id          String   @id @default(cuid())
  productId   String
  materialId  String
  percentage  Float?
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  material    Material @relation(fields: [materialId], references: [id], onDelete: Cascade)

  @@unique([productId, materialId])
}

model MediaAsset {
  id            String    @id @default(cuid())
  type          MediaType
  url           String
  alt           String?
  focalPoint    Json?
  width         Int?
  height        Int?
  duration      Int?
  publicId      String?
  provider      String?
  createdAt     DateTime  @default(now())
  productMedia  ProductMedia[]
  variantMedia  ProductVariantMedia[]
  editorialMedia EditorialBlock[]
  collectionMedia CollectionSection[]
}

model ProductMedia {
  id         String     @id @default(cuid())
  productId  String
  product    Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  assetId    String
  asset      MediaAsset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  placement  String     // hero, gallery, macro, video
  sortOrder  Int        @default(0)
  hotspotData Json?
}

model ProductVariantMedia {
  id         String       @id @default(cuid())
  variantId  String
  variant    ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  assetId    String
  asset      MediaAsset   @relation(fields: [assetId], references: [id], onDelete: Cascade)
  sortOrder  Int          @default(0)
}

model Collection {
  id            String              @id @default(cuid())
  slug          String              @unique
  season        String?
  releaseDate   DateTime?
  status        ProductStatus      @default(DRAFT)
  heroAssetId   String?
  heroAsset     MediaAsset?         @relation(fields: [heroAssetId], references: [id])
  translations  CollectionTranslation[]
  sections      CollectionSection[]
  items         CollectionItem[]
  lookbookSlides LookbookSlide[]
  drops         LimitedDrop[]
}

model CollectionTranslation {
  id           String   @id @default(cuid())
  locale       Locale
  title        String
  subtitle     String?
  description  String?
  manifesto    String?
  seoTitle     String?
  seoDescription String?
  collectionId String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@unique([collectionId, locale])
}

model CollectionSection {
  id           String     @id @default(cuid())
  collectionId String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  assetId      String?
  asset        MediaAsset? @relation(fields: [assetId], references: [id])
  sortOrder    Int        @default(0)
  layout       String     // e.g. split, full-bleed, quote
  translations CollectionSectionTranslation[]
}

model CollectionSectionTranslation {
  id         String   @id @default(cuid())
  locale     Locale
  heading    String?
  body       String?
  caption    String?
  sectionId  String
  section    CollectionSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  @@unique([sectionId, locale])
}

model CollectionItem {
  id           String   @id @default(cuid())
  collectionId String
  productId    String
  sortOrder    Int      @default(0)
  highlighted  Boolean  @default(false)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([collectionId, productId])
}

model LookbookSlide {
  id           String   @id @default(cuid())
  collectionId String
  assetId      String
  sortOrder    Int      @default(0)
  hotspotProductId String?
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  asset        MediaAsset @relation(fields: [assetId], references: [id], onDelete: Cascade)
  translations LookbookSlideTranslation[]
}

model LookbookSlideTranslation {
  id        String   @id @default(cuid())
  locale    Locale
  caption   String?
  slideId   String
  slide     LookbookSlide @relation(fields: [slideId], references: [id], onDelete: Cascade)

  @@unique([slideId, locale])
}

model EditorialPost {
  id           String        @id @default(cuid())
  slug         String        @unique
  category     EditorialCategory
  heroAssetId  String?
  heroAsset    MediaAsset?   @relation(fields: [heroAssetId], references: [id])
  publishedAt  DateTime?
  status       ProductStatus @default(DRAFT)
  seoMeta      Json?
  authorId     String?
  author       User?         @relation(fields: [authorId], references: [id])
  translations EditorialTranslation[]
  blocks       EditorialBlock[]
  featuredProducts EditorialFeature[]
}

model EditorialTranslation {
  id          String   @id @default(cuid())
  locale      Locale
  title       String
  standfirst  String?
  bodyRichText Json?
  seoTitle    String?
  seoDescription String?
  postId      String
  post        EditorialPost @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, locale])
}

model EditorialBlock {
  id         String     @id @default(cuid())
  postId     String
  post       EditorialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  type       String     // text, quote, media, carousel
  assetId    String?
  asset      MediaAsset? @relation(fields: [assetId], references: [id])
  data       Json?
  sortOrder  Int        @default(0)
  translations EditorialBlockTranslation[]
}

model EditorialBlockTranslation {
  id        String   @id @default(cuid())
  locale    Locale
  headline  String?
  body      String?
  caption   String?
  blockId   String
  block     EditorialBlock @relation(fields: [blockId], references: [id], onDelete: Cascade)

  @@unique([blockId, locale])
}

model EditorialFeature {
  id         String   @id @default(cuid())
  postId     String
  productId  String
  note       String?
  sortOrder  Int      @default(0)
  post       EditorialPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  product    Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Cart {
  id          String     @id @default(cuid())
  userId      String?
  user        User?      @relation(fields: [userId], references: [id])
  sessionKey  String?    @unique
  currency    Currency   @default(EUR)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  items       CartItem[]
}

model CartItem {
  id             String         @id @default(cuid())
  cartId         String
  variantId      String
  quantity       Int            @default(1)
  personalization PersonalizationRequest?
  cart           Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant        ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
}

model Order {
  id             String      @id @default(cuid())
  number         String      @unique
  userId         String?
  user           User?       @relation(fields: [userId], references: [id])
  status         OrderStatus @default(PENDING)
  fulfillmentStatus FulfillmentStatus @default(NOT_STARTED)
  paymentStatus  PaymentStatus @default(UNPAID)
  currency       Currency    @default(EUR)
  subtotalCents  Int
  taxCents       Int
  dutiesCents    Int?
  shippingCents  Int
  totalCents     Int
  personalizationFeeCents Int? 
  whiteGlove     Boolean     @default(false)
  confirmationEmailSent Boolean @default(false)
  placedAt       DateTime    @default(now())
  shippingAddressId String?
  billingAddressId  String?
  shippingAddress Address? @relation("OrderShipping", fields: [shippingAddressId], references: [id])
  billingAddress  Address? @relation("OrderBilling", fields: [billingAddressId], references: [id])
  items          OrderItem[]
  payments       PaymentRecord[]
  certificates   CertificateOfAuthenticity[]
}

model OrderItem {
  id             String         @id @default(cuid())
  orderId        String
  variantId      String
  productName    String
  locale         Locale         @default(EN)
  unitPriceCents Int
  quantity       Int
  personalizationRequestId String?
  monogram       String?
  personalizationNotes String?
  certificate    CertificateOfAuthenticity?
  order          Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant        ProductVariant @relation(fields: [variantId], references: [id])
  personalizationRequest PersonalizationRequest? @relation(fields: [personalizationRequestId], references: [id])
}

model PaymentRecord {
  id          String    @id @default(cuid())
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  provider    String    @default("stripe")
  providerId  String
  amountCents Int
  currency    Currency  @default(EUR)
  status      PaymentStatus
  data        Json?
  createdAt   DateTime  @default(now())
}

model CertificateOfAuthenticity {
  id          String   @id @default(cuid())
  orderItemId String   @unique
  qrCode      String   @unique
  issuedAt    DateTime @default(now())
  orderItem   OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
}

model Promotion {
  id             String   @id @default(cuid())
  code           String   @unique
  description    String?
  startsAt       DateTime?
  endsAt         DateTime?
  usageLimit     Int?
  timesUsed      Int      @default(0)
  discountType   String   // percentage, amount, shipping
  discountValue  Int
  locale         Locale?
  limitedEditionOnly Boolean @default(false)
  orders         Order[]
}

model LimitedDrop {
  id             String   @id @default(cuid())
  collectionId   String
  title          String
  startsAt       DateTime
  endsAt         DateTime?
  waitlistOpen   Boolean  @default(true)
  locale         Locale?
  collection     Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  waitlistEntries WaitlistEntry[]
}

model WaitlistEntry {
  id            String   @id @default(cuid())
  dropId        String
  productId     String?
  email         String
  locale        Locale   @default(EN)
  status        String   @default("pending")
  createdAt     DateTime @default(now())
  drop          LimitedDrop @relation(fields: [dropId], references: [id], onDelete: Cascade)
  product       Product?    @relation(fields: [productId], references: [id])
}

model Appointment {
  id           String   @id @default(cuid())
  userId       String?
  locale       Locale   @default(FR)
  boutique     String   @default("Paris")
  appointmentAt DateTime
  status       String   @default("requested")
  services     String?
  notes        String?
  concierge    String?
  user         User?    @relation(fields: [userId], references: [id])
}

model PersonalizationRequest {
  id           String   @id @default(cuid())
  userId       String?
  cartItemId   String?
  orderItemId  String?
  variantId    String?
  initials     String?
  message      String?
  preferences  Json?
  status       String   @default("pending")
  user         User?    @relation(fields: [userId], references: [id])
  variant      ProductVariant? @relation(fields: [variantId], references: [id])
  cartItem     CartItem? @relation(fields: [cartItemId], references: [id])
  orderItem    OrderItem? @relation(fields: [orderItemId], references: [id])
}

model HomepageModule {
  id            String   @id @default(cuid())
  slug          String   @unique
  type          String   // heroScene, scrollStory, spotlight
  locale        Locale
  config        Json
  activeFrom    DateTime?
  activeTo      DateTime?
  sortOrder     Int      @default(0)
}

model ProductSpotlightModule {
  id            String   @id @default(cuid())
  productId     String
  locale        Locale
  headline      String?
  subheading    String?
  assetId       String?
  moduleConfig  Json?
  product       Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  asset         MediaAsset? @relation(fields: [assetId], references: [id])

  @@unique([productId, locale])
}

model SearchLog {
  id        String   @id @default(cuid())
  query     String
  locale    Locale
  userId    String?
  ipHash    String?
  createdAt DateTime  @default(now())
}
```

## 3. Homepage Animation Plan

### Motion Stack

- **Lenis** handles smooth scrolling and exposes a normalized scroll value to GSAP ScrollTrigger.  
- **GSAP + ScrollTrigger** orchestrate pinned sequences, parallax layers, split-text reveals, and horizontal lookbook scroll.  
- **Framer Motion** powers route transitions (fade-to-charcoal), hero typography entrance, spotlight hover micro-animations, and shared layout transitions in navigation + cursor states.  
- **Custom Cursor Layer** driven via Framer Motion `motion.div` synced with pointer events for magnetic behaviors and drag cues.  
- **IntersectionObserver Guards** lazy-load heavy media and GSAP timelines, respecting `prefers-reduced-motion`.

### Scene-by-Scene Breakdown

1. **Prelude Fade (0 → 5vh)**  
   - Framer Motion fades from solid charcoal to hero frame, logo slides in with slight tracking animation.  
   - Cursor appears with “Entrer” ring once hero video buffer is ready.
2. **Pinned Hero → Atelier (5vh → 120vh)**  
   - GSAP pin hero section; video plays (Mux).  
   - Display serif headline scales down while sans-serif detail fades in; CTA magnetically follows cursor.  
   - ScrollTrigger scrub morphs overlay gradient to reveal atelier footage; Lenis ensures buttery progress.
3. **Craft Triptych (120vh → 220vh)**  
   - Split text animation reveals “Les Mains de l’Atelier” line by line; parallax macro images slide in from offsets.  
   - Scroll-driven opacity to highlight craftsmanship stats with subtle gold accent lines.
4. **Fabric Macro Reveal (220vh → 320vh)**  
   - Zoom effect via GSAP `scale` on stacked layers; copy columns crossfade FR/EN simultaneously (language toggle anchored).  
   - Material provenance line draws using SVG path animation triggered mid-section.
5. **Collection Spotlight Carousel (320vh → 420vh)**  
   - Horizontal scroll-jacked gallery controlled by vertical scroll; each frame transitions via cover wipe.  
   - Cursor switches to “drag” state with Framer Motion variant; product meta slides up on hover.
6. **Lookbook Scroll Scene (420vh → 520vh)**  
   - Pinned segment with layered imagery; ScrollTrigger moves lookbook panels horizontally while typography columns scrub vertically, creating cinematic montage.  
   - GSAP timeline also drives audio cue toggle prompt (muted by default).
7. **Maison Heritage Timeline (520vh → 620vh)**  
   - Parallax map lines trace as user scrolls; timeline nodes highlight with Framer Motion layout transitions.  
   - Each milestone loads corresponding archival clip into side viewport using `<Suspense>` boundaries to keep thread responsive.
8. **Journal Teaser Grid (620vh → 700vh)**  
   - Mosaic grid animates on with staggered scale/opacity; entries tilt slightly on hover with perspective transform.  
   - Locale-specific tagline crossfades, ensuring bilingual parity.
9. **Appointment & Services Finale (700vh → 780vh)**  
   - Full-bleed video loop fades in; CTA button uses GSAP “magnet” effect (button shifts toward cursor).  
   - Background color transitions to charcoal preparing for footer.
10. **Footer Curtain (780vh → end)**  
    - Footer slides from bottom while rest dims; newsletter input expands with focus animation; social links align with cursor magnetism.

### Technical Hooks

- Use shared `useLenisGSAP()` hook to register ScrollTrigger with Lenis’ RAF tick.  
- Create `useLocaleSplitText()` util to split bilingual headings without re-measuring on toggle.  
- Encapsulate each scene as a server component wrapper with client-side motion child for hydration boundaries.  
- Preload Mux hero video poster + first chunk; degrade to high-res image for reduced motion mode.  
- Add `reducedMotion` context to short-circuit scroll-jacking and fallback to fade transitions.

## 4. Hero Concept Refresh (Implementation Notes)

- **Video Immersion**: hero runs a looping atelier-night film (Mux/placeholder) behind frosted glass gradients. Overlay uses rotating grain + subtle vignette. Provide fallback image for `prefers-reduced-motion`.
- **Typography Stack**: split text lines animating via Framer Motion; supporting sans text tracks along a baseline grid with letter spacing reminiscent of couture invites.
- **Dual CTA Strip**: `Entrer dans la collection` (primary) + `Voir le film` (ghost) with micro hover magnetism.
- **Stat Totems**: floating glass cards pinned near fold with craft data + atelier locations, each shimmering on scroll.
- **Supporting Sections**: 
  - `ArtisanMarquee`: infinite marquee referencing ateliers, fabric houses, and services.
  - `LookbookCarousel`: horizontal scroll tied to vertical progress, showing editorial stills with parallax copy.
  - `MaisonTimeline`: timeline nodes referencing Paris heritage anchors with map-inspired dividers.
  - `LimitedDropBanner`: countdown + waitlist CTA with shimmering gradient.
- **Galerie Vivante Sequence**:
  - `GalleryScrollScene`: pinned section emulating a white-cube gallery; vertical scroll drives horizontal track of canvases featuring materials, atelier portraits, and sketches. Use Framer `useScroll` to translate track + fade metadata columns.
  - `AtelierDiptych`: vertical split layout inspired by French diptychs—left column is text, right column stacks film stills with parallax; add subtle grain overlay.
  - `SculptedQuotes`: rotate quotes from artistic director using large serif typography and fade-through transitions, reinforcing gallery manifesto vibes.
