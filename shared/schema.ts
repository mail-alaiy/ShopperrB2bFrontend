import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  doublePrecision,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with additional authentication fields
export const users = pgTable("users", {
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  phone: text("phone").notNull().unique(),
  gstNumber: text("gst_number").notNull().unique(),
  address: text("address"),
  city: text("city").notNull(),
  state: text("state"),
  pincode: text("pincode"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  role: text("role").default("customer").notNull(), // customer, admin
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Schema used for user registration
export const registerUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().min(10, "Phone number is required"),
  gstNumber: z.string().min(15, "GST number is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

// Schema used for user login
export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Schema used for OTP verification
export const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  otp: z.string().min(4, "OTP is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
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

export const insertRelatedProductSchema = createInsertSchema(
  relatedProducts
).omit({
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

// OTP schema for verification
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: text("expires_at").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertOtpSchema = createInsertSchema(otps).omit({
  id: true,
  verified: true,
});

export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type Otp = typeof otps.$inferSelect;

// User sessions schema for authentication
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
