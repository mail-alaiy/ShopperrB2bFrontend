import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  const { isAuthenticated } = setupAuth(app);
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get a specific product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get price tiers for a product
  app.get("/api/products/:id/price-tiers", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const priceTiers = await storage.getPriceTiers(id);
      res.json(priceTiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price tiers" });
    }
  });

  // Get related products
  app.get("/api/products/:id/related", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const type = req.query.type as string || "related";
      const relatedProducts = await storage.getRelatedProducts(id, type);
      res.json(relatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch related products" });
    }
  });

  // Get products by category
  app.get("/api/categories/:category/products", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsInCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products in category" });
    }
  });

  // Get products by subcategory
  app.get("/api/subcategories/:subcategory/products", async (req: Request, res: Response) => {
    try {
      const subcategory = req.params.subcategory;
      const products = await storage.getProductsInSubcategory(subcategory);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products in subcategory" });
    }
  });

  // Get cart items
  app.get("/api/cart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get user ID from the authenticated session
      const userId = req.user!.id;
      const cartItems = await storage.getCartItemsWithProducts(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  // Add item to cart
  app.post("/api/cart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get user ID from the authenticated session
      const userId = req.user!.id;
      
      const bodySchema = z.object({
        productId: z.number(),
        quantity: z.number().min(1)
      });
      
      const validationResult = bodySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors 
        });
      }
      
      const { productId, quantity } = validationResult.data;
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const cartItem = await storage.addToCart({
        userId,
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
      
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const bodySchema = z.object({
        quantity: z.number().min(1)
      });
      
      const validationResult = bodySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors 
        });
      }
      
      const { quantity } = validationResult.data;
      
      // Get user ID from authenticated session
      const userId = req.user!.id;
      
      // Verify this cart item belongs to the authenticated user
      const cartItems = await storage.getCartItems(userId);
      const cartItemBelongsToUser = cartItems.some(item => item.id === id);
      
      if (!cartItemBelongsToUser) {
        return res.status(403).json({ message: "Not authorized to update this cart item" });
      }
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      // Get user ID from authenticated session
      const userId = req.user!.id;
      
      // Verify this cart item belongs to the authenticated user
      const cartItems = await storage.getCartItems(userId);
      const cartItemBelongsToUser = cartItems.some(item => item.id === id);
      
      if (!cartItemBelongsToUser) {
        return res.status(403).json({ message: "Not authorized to delete this cart item" });
      }
      
      await storage.removeFromCart(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Create a new order (checkout)
  app.post("/api/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      
      // Get the current cart items
      const cartItems = await storage.getCartItemsWithProducts(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cannot create an order with an empty cart" });
      }
      
      // For simplicity in this demo, we're just going to clear the cart
      // In a real application, you would create an order record, process payment, etc.
      for (const item of cartItems) {
        await storage.removeFromCart(item.id);
      }
      
      // Return a success response
      res.status(201).json({
        id: Date.now(),
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        items: cartItems.length,
        total: cartItems.reduce((sum, item) => sum + (item.quantity * item.product.salePrice), 0),
        status: "Processing",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
