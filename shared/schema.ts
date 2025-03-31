import { pgTable, text, serial, integer, boolean, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  brand: text("brand").notNull(),
  sku: text("sku").notNull().unique(),
  rating: doublePrecision("rating").notNull(),
  ratingCount: integer("rating_count").notNull(),
  regularPrice: doublePrecision("regular_price").notNull(),
  salePrice: doublePrecision("sale_price").notNull(),
  features: json("features").notNull(),
  images: json("images").notNull(),
  variations: json("variations").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Price tier schema
export const priceTiers = pgTable("price_tiers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  minQuantity: integer("min_quantity").notNull(),
  maxQuantity: integer("max_quantity").notNull(),
  price: doublePrecision("price").notNull(),
  savingsPercentage: doublePrecision("savings_percentage").notNull(),
});

export const insertPriceTierSchema = createInsertSchema(priceTiers).omit({
  id: true,
});

export type InsertPriceTier = z.infer<typeof insertPriceTierSchema>;
export type PriceTier = typeof priceTiers.$inferSelect;

// Related product schema - to store relationships between products
export const relatedProducts = pgTable("related_products", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  relatedProductId: integer("related_product_id").notNull(),
  relationshipType: text("relationship_type").notNull(), // e.g., "related", "frequently_bought_together"
});

export const insertRelatedProductSchema = createInsertSchema(relatedProducts).omit({
  id: true,
});

export type InsertRelatedProduct = z.infer<typeof insertRelatedProductSchema>;
export type RelatedProduct = typeof relatedProducts.$inferSelect;

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  addedAt: text("added_at").notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
