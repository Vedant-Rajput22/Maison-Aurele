/**
 * Maison Aurèle – Seed Data Index
 * Central export for all seed data modules
 */

// Foundation data
export { materials } from "./materials";
export type { MaterialSeedData } from "./materials";

export { categories } from "./categories";
export type { CategorySeedData, CategoryTranslationSeed } from "./categories";

// Products
export { products as productsOuterwear } from "./products-outerwear";
export type { ProductSeed, ProductVariantSeed } from "./products-outerwear";

export { productsDresses } from "./products-dresses";
export { productsKnitwear, productsTops } from "./products-knitwear-tops";
export { productsBottoms, productsBags, productsAccessories } from "./products-accessories";
export { productsShoes } from "./products-shoes";

// Collections
export { collections } from "./collections";
export type { CollectionSeed, CollectionSectionSeed, LookbookSlideSeed } from "./collections";

// Editorial
export { editorialPosts } from "./editorial";
export type { EditorialSeed, EditorialBlockSeed, EditorialFeatureSeed } from "./editorial";

// Commerce
export { promotions, limitedDrops, sampleAppointments } from "./commerce";
export type { PromotionSeed, LimitedDropSeed, AppointmentSeed } from "./commerce";

// Aggregate all products for convenience
import { products as productsOuterwear } from "./products-outerwear";
import { productsDresses } from "./products-dresses";
import { productsKnitwear, productsTops } from "./products-knitwear-tops";
import { productsBottoms, productsBags, productsAccessories } from "./products-accessories";
import { productsShoes } from "./products-shoes";

export const allProducts = [
    ...productsOuterwear,
    ...productsDresses,
    ...productsKnitwear,
    ...productsTops,
    ...productsBottoms,
    ...productsBags,
    ...productsAccessories,
    ...productsShoes,
];
