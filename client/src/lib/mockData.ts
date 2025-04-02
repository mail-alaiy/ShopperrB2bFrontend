// Types import from shared schema
import { Product, CartItem, User, PriceTier, RelatedProduct } from '@shared/schema';

// Mock products data - simplified to only show one wireless keyboard product
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Professional Wireless Keyboard and Mouse Combo",
    brand: "Logitech",
    description: "Ergonomic wireless keyboard and mouse combo designed for professional use with long battery life and customizable keys.",
    regularPrice: 129.99,
    salePrice: 99.99,
    sku: "LOG-KB-MS-2023",
    rating: 4.5,
    ratingCount: 1245,
    features: {
      inStock: true,
      shippingOptions: ["Standard", "Express", "Next Day"],
      specifications: {
        connectivity: "Wireless 2.4GHz",
        batteryLife: "Up to 24 months (keyboard), 12 months (mouse)",
        compatibility: "Windows, macOS, Chrome OS",
        dimensions: "Keyboard: 17.5 x 5.5 x 0.8 inches, Mouse: 4.0 x 2.5 x 1.3 inches",
        weight: "Keyboard: 1.8 lbs, Mouse: 0.25 lbs"
      }
    },
    images: [
      "https://m.media-amazon.com/images/I/71uL9ZV6zIL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71jZb5D65dL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71xQT6m4qDL._AC_SX679_.jpg"
    ],
    variations: {},
    category: "computer-accessories",
    subcategory: "keyboards-mice"
  }
];

// Mock categories and subcategories
export const mockCategories = [
  {
    id: 1,
    name: "Computer Accessories",
    slug: "computer-accessories",
    subcategories: [
      { id: 1, name: "Keyboards & Mice", slug: "keyboards-mice" },
      { id: 2, name: "Monitors & Displays", slug: "monitors-displays" },
      { id: 3, name: "Laptop Accessories", slug: "laptop-accessories" }
    ]
  },
  {
    id: 2,
    name: "Office Supplies",
    slug: "office-supplies",
    subcategories: [
      { id: 4, name: "Desk Accessories", slug: "desk-accessories" },
      { id: 5, name: "Ergonomic Accessories", slug: "ergonomic-accessories" },
      { id: 6, name: "Paper & Notebooks", slug: "paper-notebooks" }
    ]
  },
  {
    id: 3,
    name: "Office Electronics",
    slug: "office-electronics",
    subcategories: [
      { id: 7, name: "Audio & Video", slug: "audio-video" },
      { id: 8, name: "Printers & Scanners", slug: "printers-scanners" },
      { id: 9, name: "Projectors", slug: "projectors" }
    ]
  }
];

// Mock price tiers data
export const mockPriceTiers: PriceTier[] = [
  {
    id: 1,
    productId: 1,
    minQuantity: 1,
    maxQuantity: 9,
    price: 99.99,
    savingsPercentage: 0
  },
  {
    id: 2,
    productId: 1,
    minQuantity: 10,
    maxQuantity: 24,
    price: 89.99,
    savingsPercentage: 10
  },
  {
    id: 3,
    productId: 1,
    minQuantity: 25,
    maxQuantity: 49,
    price: 79.99,
    savingsPercentage: 20
  },
  {
    id: 4,
    productId: 1,
    minQuantity: 50,
    maxQuantity: 99,
    price: 69.99,
    savingsPercentage: 30
  },
  {
    id: 5,
    productId: 1,
    minQuantity: 100,
    maxQuantity: 999,
    price: 59.99,
    savingsPercentage: 40
  }
];

// Mock related products - simplified to only use the wireless keyboard product
export const mockRelatedProducts: RelatedProduct[] = [
  {
    id: 1,
    productId: 1,
    relatedProductId: 1,
    relationshipType: "frequently-bought-together"
  },
  {
    id: 2,
    productId: 1,
    relatedProductId: 1,
    relationshipType: "similar-product"
  }
];

// Mock user data (for authentication)
export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    password: "password123.hashed", // Pretend this is properly hashed
    companyName: "Acme Corporation",
    phone: "1234567890",
    gstNumber: "22AAAAA0000A1Z5",
    city: "New York",
    address: "123 Business Ave, Suite 100",
    state: "NY",
    pincode: "10001",
    isVerified: true,
    createdAt: "2023-05-01T12:00:00Z",
    updatedAt: "2023-09-15T09:30:00Z",
    role: "customer"
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    password: "securepass.hashed", // Pretend this is properly hashed
    companyName: "Global Trading Co.",
    phone: "9876543210",
    gstNumber: "29BBBBB0000B1Z2",
    city: "Los Angeles",
    address: "456 Commerce Blvd",
    state: "CA",
    pincode: "90001",
    isVerified: true,
    createdAt: "2023-06-15T14:30:00Z",
    updatedAt: "2023-09-10T16:45:00Z",
    role: "customer"
  }
];

// Mock cart items - simplified to only use the wireless keyboard product with different quantities
export const mockCartItems: (CartItem & { product: Product })[] = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    addedAt: "2023-09-20T10:15:00Z",
    product: mockProducts[0]
  }
];

// Function to get mock data based on URL pattern
export function getMockData(url: string) {
  // Match URL patterns and return appropriate mock data
  
  // Get all products
  if (url === '/api/products') {
    return mockProducts;
  }
  
  // Get a specific product by ID
  if (url.match(/^\/api\/products\/\d+$/)) {
    const id = parseInt(url.split('/').pop() || '0');
    return mockProducts.find(product => product.id === id);
  }
  
  // Get price tiers for a product
  if (url.match(/^\/api\/products\/\d+\/price-tiers$/)) {
    const id = parseInt(url.split('/')[3]);
    return mockPriceTiers.filter(tier => tier.productId === id);
  }
  
  // Get related products
  if (url.match(/^\/api\/products\/\d+\/related$/)) {
    const id = parseInt(url.split('/')[3]);
    const relations = mockRelatedProducts.filter(rel => rel.productId === id);
    
    return relations.map(rel => {
      return mockProducts.find(product => product.id === rel.relatedProductId);
    }).filter(Boolean);
  }
  
  // Get products by category
  if (url.match(/^\/api\/categories\/.*\/products$/)) {
    const categorySlug = url.split('/')[3];
    return mockProducts.filter(product => product.category === categorySlug);
  }
  
  // Get products by subcategory
  if (url.match(/^\/api\/subcategories\/.*\/products$/)) {
    const subcategorySlug = url.split('/')[3];
    return mockProducts.filter(product => product.subcategory === subcategorySlug);
  }
  
  // Get cart items
  if (url === '/api/cart') {
    return mockCartItems;
  }
  
  // Get authenticated user
  if (url === '/api/user') {
    // Return the first mock user (for demonstration purposes)
    // In a real app, this would check authentication state
    const { password, ...userWithoutPassword } = mockUsers[0];
    return userWithoutPassword;
  }
  
  // Default: Return empty array if no match
  return [];
}

// Function to simulate API modifications (POST, PUT, DELETE)
export function modifyMockData(method: string, url: string, data?: any) {
  // Handle cart modifications
  if (url === '/api/cart' && method === 'POST') {
    // Add to cart simulation
    const newItem = {
      id: mockCartItems.length + 1,
      userId: 1, // Assume user 1 for demo
      productId: data.productId,
      quantity: data.quantity || 1,
      addedAt: new Date().toISOString(),
      product: mockProducts.find(p => p.id === data.productId) as Product
    };
    
    // Add to mock cart
    mockCartItems.push(newItem as any);
    return newItem;
  }
  
  // Handle cart item update
  if (url.match(/^\/api\/cart\/\d+$/) && method === 'PATCH') {
    const id = parseInt(url.split('/').pop() || '0');
    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    
    if (itemIndex >= 0) {
      mockCartItems[itemIndex].quantity = data.quantity;
      return mockCartItems[itemIndex];
    }
  }
  
  // Handle cart item deletion
  if (url.match(/^\/api\/cart\/\d+$/) && method === 'DELETE') {
    const id = parseInt(url.split('/').pop() || '0');
    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    
    if (itemIndex >= 0) {
      const removed = mockCartItems.splice(itemIndex, 1);
      return removed[0];
    }
  }
  
  // Handle user login
  if (url === '/api/login' && method === 'POST') {
    const user = mockUsers.find(u => u.email === data.email);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    // In a real implementation, this would validate the password
    throw new Error('Invalid email or password');
  }
  
  // Handle user registration
  if (url === '/api/register' && method === 'POST') {
    const newUser = {
      ...data,
      id: mockUsers.length + 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'customer'
    };
    
    mockUsers.push(newUser as User);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  // Handle user logout
  if (url === '/api/logout' && method === 'POST') {
    return { success: true };
  }
  
  // If no handler matches
  return null;
}