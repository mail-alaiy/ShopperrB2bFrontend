import { 
  users, type User, type InsertUser, type RegisterUser, type LoginUser,
  products, type Product, type InsertProduct,
  priceTiers, type PriceTier, type InsertPriceTier,
  relatedProducts, type RelatedProduct, type InsertRelatedProduct,
  cartItems, type CartItem, type InsertCartItem,
  otps, type Otp, type InsertOtp, type VerifyOtp,
  sessions, type Session, type InsertSession
} from "@shared/schema";

export interface IStorage {
  // User Authentication Methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined>;
  verifyUser(id: number): Promise<User | undefined>;
  
  // OTP Methods
  createOtp(otp: InsertOtp): Promise<Otp>;
  getOtpByPhone(phone: string): Promise<Otp | undefined>;
  verifyOtp(phone: string, otp: string): Promise<boolean>;
  
  // Session Methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsInCategory(category: string): Promise<Product[]>;
  getProductsInSubcategory(subcategory: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Price Tiers
  getPriceTiers(productId: number): Promise<PriceTier[]>;
  createPriceTier(priceTier: InsertPriceTier): Promise<PriceTier>;
  
  // Related Products
  getRelatedProducts(productId: number, relationshipType: string): Promise<Product[]>;
  createRelatedProduct(relatedProduct: InsertRelatedProduct): Promise<RelatedProduct>;
  
  // Cart Items
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItemsWithProducts(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private priceTiers: Map<number, PriceTier>;
  private relatedProducts: Map<number, RelatedProduct>;
  private cartItems: Map<number, CartItem>;
  private otps: Map<string, Otp>;
  private sessions: Map<string, Session>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private priceTierIdCounter: number;
  private relatedProductIdCounter: number;
  private cartItemIdCounter: number;
  private otpIdCounter: number;
  private sessionIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.priceTiers = new Map();
    this.relatedProducts = new Map();
    this.cartItems = new Map();
    this.otps = new Map();
    this.sessions = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.priceTierIdCounter = 1;
    this.relatedProductIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.otpIdCounter = 1;
    this.sessionIdCounter = 1;
    
    // Initialize with some products
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    // Since we're using email as username
    return this.getUserByEmail(username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date().toISOString();
    
    const user: User = { 
      ...insertUser, 
      id,
      isVerified: false,
      role: 'customer',
      createdAt: insertUser.createdAt || now,
      updatedAt: insertUser.updatedAt || now,
      address: insertUser.address || null,
      state: insertUser.state || null,
      pincode: insertUser.pincode || null,
    };
    
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsInCategory(category: string): Promise<Product[]> {
    // Convert kebab-case to space-separated words with capitalization
    const formattedCategory = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === formattedCategory.toLowerCase()
    );
  }
  
  async getProductsInSubcategory(subcategory: string): Promise<Product[]> {
    // Convert kebab-case to space-separated words with capitalization
    const formattedSubcategory = subcategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return Array.from(this.products.values()).filter(
      (product) => product.subcategory.toLowerCase() === formattedSubcategory.toLowerCase()
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Synchronous version for use within initializeData
  private createProductSync(insertProduct: InsertProduct): Product {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Price tier methods
  async getPriceTiers(productId: number): Promise<PriceTier[]> {
    return Array.from(this.priceTiers.values()).filter(
      (tier) => tier.productId === productId
    );
  }
  
  async createPriceTier(insertPriceTier: InsertPriceTier): Promise<PriceTier> {
    const id = this.priceTierIdCounter++;
    const priceTier: PriceTier = { ...insertPriceTier, id };
    this.priceTiers.set(id, priceTier);
    return priceTier;
  }
  
  // Synchronous version for use within initializeData
  private createPriceTierSync(insertPriceTier: InsertPriceTier): PriceTier {
    const id = this.priceTierIdCounter++;
    const priceTier: PriceTier = { ...insertPriceTier, id };
    this.priceTiers.set(id, priceTier);
    return priceTier;
  }
  
  // Related products methods
  async getRelatedProducts(productId: number, relationshipType: string): Promise<Product[]> {
    const relatedIds = Array.from(this.relatedProducts.values())
      .filter(rel => rel.productId === productId && rel.relationshipType === relationshipType)
      .map(rel => rel.relatedProductId);
    
    return relatedIds.map(id => this.products.get(id)).filter(Boolean) as Product[];
  }
  
  async createRelatedProduct(insertRelatedProduct: InsertRelatedProduct): Promise<RelatedProduct> {
    const id = this.relatedProductIdCounter++;
    const relatedProduct: RelatedProduct = { ...insertRelatedProduct, id };
    this.relatedProducts.set(id, relatedProduct);
    return relatedProduct;
  }
  
  // Synchronous version for use within initializeData
  private createRelatedProductSync(insertRelatedProduct: InsertRelatedProduct): RelatedProduct {
    const id = this.relatedProductIdCounter++;
    const relatedProduct: RelatedProduct = { ...insertRelatedProduct, id };
    this.relatedProducts.set(id, relatedProduct);
    return relatedProduct;
  }
  
  // Cart items methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getCartItemsWithProducts(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await this.getCartItems(userId);
    return items
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean) as (CartItem & { product: Product })[];
  }
  
  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );
    
    if (existingItem) {
      // Update the quantity
      return this.updateCartItem(existingItem.id, existingItem.quantity + insertCartItem.quantity) as Promise<CartItem>;
    }
    
    // Add new item
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  // User Authentication Methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async verifyUser(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isVerified: true };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // OTP Methods
  async createOtp(insertOtp: InsertOtp): Promise<Otp> {
    const id = this.otpIdCounter++;
    const otp: Otp = { ...insertOtp, id, verified: false };
    this.otps.set(insertOtp.phone, otp);
    return otp;
  }

  async getOtpByPhone(phone: string): Promise<Otp | undefined> {
    return this.otps.get(phone);
  }

  async verifyOtp(phone: string, otpCode: string): Promise<boolean> {
    const otp = this.otps.get(phone);
    if (!otp) return false;
    
    const now = new Date().toISOString();
    if (otp.expiresAt < now) return false;
    
    if (otp.otp !== otpCode) return false;
    
    // Mark as verified
    const verifiedOtp = { ...otp, verified: true };
    this.otps.set(phone, verifiedOtp);
    
    return true;
  }

  // Session Methods
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const session: Session = { ...insertSession, id };
    this.sessions.set(insertSession.token, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    return this.sessions.get(token);
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }
  
  // Initialize with some data
  private initializeData() {
    // Keyboard and Mouse Combo
    const keyboardMouseCombo = this.createProductSync({
      name: "Professional Wireless Keyboard and Mouse Combo - Business Edition",
      description: "The Professional Wireless Keyboard and Mouse Combo - Business Edition is designed specifically for office environments and business use. This premium set delivers reliable wireless performance with a range of up to 33 feet, making it perfect for conference rooms, workstations, and shared spaces.",
      brand: "Shopperr Business Electronics",
      sku: "KWMB-1001",
      rating: 4.5,
      ratingCount: 428,
      regularPrice: 59.99,
      salePrice: 49.99,
      features: [
        "Ergonomic design optimized for all-day business use",
        "Advanced wireless technology with 33ft range",
        "Compatible with Windows, Mac, Linux, and Chrome OS",
        "Long battery life - up to 24 months for keyboard, 12 months for mouse",
        "Bulk packaging available for business deployment",
        "3-year business warranty with dedicated support"
      ],
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        "https://images.unsplash.com/photo-1561112078-7d24e04c3407",
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
        "https://images.unsplash.com/photo-1531492643958-815c97c4d58d"
      ],
      variations: [
        { id: 1, name: "Standard" },
        { id: 2, name: "Business Edition", selected: true },
        { id: 3, name: "Ergonomic Pro" },
        { id: 4, name: "Compact" }
      ],
      category: "Office Electronics",
      subcategory: "Computer Peripherals"
    });

    // Price tiers for keyboard
    this.createPriceTierSync({
      productId: keyboardMouseCombo.id,
      minQuantity: 1,
      maxQuantity: 9,
      price: 49.99,
      savingsPercentage: 0
    });
    
    this.createPriceTierSync({
      productId: keyboardMouseCombo.id,
      minQuantity: 10,
      maxQuantity: 24,
      price: 45.99,
      savingsPercentage: 8
    });
    
    this.createPriceTierSync({
      productId: keyboardMouseCombo.id,
      minQuantity: 25,
      maxQuantity: 49,
      price: 42.99,
      savingsPercentage: 14
    });
    
    this.createPriceTierSync({
      productId: keyboardMouseCombo.id,
      minQuantity: 50,
      maxQuantity: 999999,
      price: 39.99,
      savingsPercentage: 20
    });
    
    // Related products
    const wirelessMouse = this.createProductSync({
      name: "Wireless Business Mouse with Programmable Buttons",
      description: "Professional wireless mouse with programmable buttons for business use",
      brand: "Shopperr Business Electronics",
      sku: "WM-2001",
      rating: 4.5,
      ratingCount: 312,
      regularPrice: 29.99,
      salePrice: 24.99,
      features: [
        "6 programmable buttons",
        "Advanced tracking sensor",
        "Ergonomic design",
        "Up to 12 months battery life",
        "Compatible with all major operating systems"
      ],
      images: [
        "https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38"
      ],
      variations: [],
      category: "Office Electronics",
      subcategory: "Computer Peripherals"
    });
    
    const wristRest = this.createProductSync({
      name: "Memory Foam Keyboard Wrist Rest - Office Pack (5-pack)",
      description: "Comfortable memory foam wrist rest for keyboard use",
      brand: "Shopperr Office Comfort",
      sku: "KWR-3001",
      rating: 4.0,
      ratingCount: 87,
      regularPrice: 34.99,
      salePrice: 29.99,
      features: [
        "Memory foam provides superior comfort",
        "Non-slip base keeps wrist rest in place",
        "Set of 5 for office deployment",
        "Easy to clean surface",
        "Reduces wrist strain during long typing sessions"
      ],
      images: [
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef"
      ],
      variations: [],
      category: "Office Supplies",
      subcategory: "Ergonomic Accessories"
    });
    
    const usbHub = this.createProductSync({
      name: "4-Port USB 3.0 Hub with Extended Cable",
      description: "Expand your connectivity with this 4-port USB hub",
      brand: "Shopperr Tech Essentials",
      sku: "USB-4001",
      rating: 5.0,
      ratingCount: 543,
      regularPrice: 24.99,
      salePrice: 19.99,
      features: [
        "4 USB 3.0 ports",
        "Extended cable for flexible positioning",
        "Backward compatible with USB 2.0",
        "Plug and play, no drivers needed",
        "Compact design ideal for travel"
      ],
      images: [
        "https://images.unsplash.com/photo-1585770536735-27993a080586"
      ],
      variations: [],
      category: "Office Electronics",
      subcategory: "Computer Accessories"
    });
    
    const usbAdapter = this.createProductSync({
      name: "USB-C to USB Adapter - Business Bulk Pack (10-pack)",
      description: "USB-C to USB adapters for modern device compatibility",
      brand: "Shopperr Tech Essentials",
      sku: "USBC-5001",
      rating: 4.5,
      ratingCount: 229,
      regularPrice: 39.99,
      salePrice: 34.99,
      features: [
        "10-pack of USB-C to USB adapters",
        "Compatible with all USB-C devices",
        "Data transfer speeds up to 5 Gbps",
        "Durable construction for business use",
        "Plug and play, no drivers needed"
      ],
      images: [
        "https://images.unsplash.com/photo-1625822638359-f2f4236d7faa"
      ],
      variations: [],
      category: "Office Electronics",
      subcategory: "Computer Accessories"
    });
    
    const laptopStand = this.createProductSync({
      name: "Adjustable Laptop Stand for Business Desks",
      description: "Ergonomic laptop stand with adjustable height",
      brand: "Shopperr Office Ergonomics",
      sku: "LS-6001",
      rating: 4.0,
      ratingCount: 178,
      regularPrice: 47.99,
      salePrice: 42.99,
      features: [
        "Adjustable height settings",
        "Compatible with laptops up to 17 inches",
        "Aluminum construction for durability",
        "Improves posture and reduces neck strain",
        "Foldable for easy storage and transport"
      ],
      images: [
        "https://images.unsplash.com/photo-1638614163701-84b36d8786d3"
      ],
      variations: [],
      category: "Office Furniture",
      subcategory: "Desk Accessories"
    });
    
    const deskPad = this.createProductSync({
      name: "Extended Desk Pad - Professional Series",
      description: "Large desk pad for improved workspace comfort",
      brand: "Shopperr Office Comfort",
      sku: "DP-7001",
      rating: 3.5,
      ratingCount: 92,
      regularPrice: 24.99,
      salePrice: 21.99,
      features: [
        "Extended size covers large work area",
        "Water-resistant surface",
        "Non-slip base keeps pad in place",
        "Smooth surface for precise mouse movement",
        "Professional black finish"
      ],
      images: [
        "https://images.unsplash.com/photo-1643151072427-078713138471"
      ],
      variations: [],
      category: "Office Supplies",
      subcategory: "Desk Accessories"
    });
    
    const mousePad = this.createProductSync({
      name: "Professional Mouse Pad with Stitched Edges (Large)",
      description: "Premium mouse pad with stitched edges for durability",
      brand: "Shopperr Office Comfort",
      sku: "MP-8001",
      rating: 4.0,
      ratingCount: 156,
      regularPrice: 17.99,
      salePrice: 14.99,
      features: [
        "Smooth cloth surface for precise tracking",
        "Stitched edges prevent fraying",
        "Non-slip rubber base",
        "Large size for low-sensitivity settings",
        "Water-resistant coating"
      ],
      images: [
        "https://images.unsplash.com/photo-1547394765-185e1e68f34e"
      ],
      variations: [],
      category: "Office Supplies",
      subcategory: "Desk Accessories"
    });
    
    // Create relationships
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: wirelessMouse.id,
      relationshipType: "related"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: wristRest.id,
      relationshipType: "related"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: usbHub.id,
      relationshipType: "related"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: usbAdapter.id,
      relationshipType: "related"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: laptopStand.id,
      relationshipType: "related"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: deskPad.id,
      relationshipType: "related"
    });
    
    // Frequently bought together
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: wristRest.id,
      relationshipType: "frequently_bought_together"
    });
    
    this.createRelatedProductSync({
      productId: keyboardMouseCombo.id,
      relatedProductId: mousePad.id,
      relationshipType: "frequently_bought_together"
    });
  }
}

export const storage = new MemStorage();
