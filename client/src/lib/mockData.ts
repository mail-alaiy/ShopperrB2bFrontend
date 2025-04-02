// Types import from shared schema
import { Product, CartItem, User, PriceTier, RelatedProduct } from '@shared/schema';

// Mock products data
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
  },
  {
    id: 2,
    name: "Wireless Business Mouse with Programmable Buttons",
    brand: "Microsoft",
    description: "Professional-grade wireless mouse with 5 programmable buttons and advanced tracking for precise control on any surface.",
    regularPrice: 69.99,
    salePrice: 49.99,
    sku: "MS-MOUSE-2023",
    rating: 4.3,
    ratingCount: 823,
    features: {
      inStock: true,
      shippingOptions: ["Standard", "Express"],
      specifications: {
        connectivity: "Bluetooth 5.0",
        batteryLife: "Up to 8 months",
        compatibility: "Windows, macOS",
        tracking: "4000 DPI optical sensor",
        programmableButtons: 5,
        weight: "0.28 lbs"
      }
    },
    images: [
      "https://m.media-amazon.com/images/I/61m59VlB8DL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71DBKUKJrpL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71Vl++WQgkL._AC_SX679_.jpg"
    ],
    variations: {},
    category: "computer-accessories",
    subcategory: "keyboards-mice"
  },
  {
    id: 3,
    name: "Memory Foam Keyboard Wrist Rest - Office Comfort Series",
    brand: "Ergodyne",
    description: "Premium memory foam wrist rest designed to provide maximum comfort and ergonomic support during long hours of typing.",
    regularPrice: 24.99,
    salePrice: 19.99,
    sku: "ERG-WRIST-001",
    rating: 4.7,
    ratingCount: 1532,
    features: {
      inStock: true,
      shippingOptions: ["Standard", "Express", "Next Day"],
      specifications: {
        material: "High-density memory foam with breathable lycra cover",
        dimensions: "17.5 x 3.0 x 1.0 inches",
        weight: "0.4 lbs",
        color: "Black",
        features: "Non-slip base, stain-resistant fabric"
      }
    },
    images: [
      "https://m.media-amazon.com/images/I/71RrlmPEMaL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71QmLfIl35L._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71nD35rH0xL._AC_SX679_.jpg"
    ],
    variations: {},
    category: "office-supplies",
    subcategory: "ergonomic-accessories"
  },
  {
    id: 4,
    name: "Ultra-Thin Bluetooth Keyboard for Multiple Devices",
    brand: "Anker",
    description: "Slim, portable Bluetooth keyboard that connects to up to 3 devices simultaneously with easy switching between them.",
    regularPrice: 59.99,
    salePrice: 45.99,
    sku: "ANK-KB-THIN-3",
    rating: 4.2,
    ratingCount: 687,
    features: {
      inStock: true,
      shippingOptions: ["Standard", "Express"],
      specifications: {
        connectivity: "Bluetooth 5.0, multi-device (up to 3)",
        batteryLife: "Up to 6 months",
        compatibility: "iOS, Android, Windows, macOS",
        dimensions: "11.2 x 5.0 x 0.6 inches",
        weight: "0.6 lbs",
        keyType: "Scissor switch with low profile"
      }
    },
    images: [
      "https://m.media-amazon.com/images/I/61V9v9vKRqL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71LcFBl5noL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71egf2pB6dL._AC_SX679_.jpg"
    ],
    variations: {},
    category: "computer-accessories",
    subcategory: "keyboards-mice"
  },
  {
    id: 5,
    name: "Premium Felt Desk Mat with Leather Accents",
    brand: "Oakywood",
    description: "Luxurious desk mat made of premium felt with genuine leather accents, providing a sophisticated and comfortable workspace.",
    regularPrice: 89.99,
    salePrice: 74.99,
    sku: "OAK-MAT-FELT",
    rating: 4.8,
    ratingCount: 312,
    features: {
      inStock: true,
      shippingOptions: ["Standard", "Express"],
      specifications: {
        material: "4mm premium merino wool felt with vegetable-tanned leather",
        dimensions: "30.7 x 11.8 inches",
        weight: "0.9 lbs",
        colors: ["Charcoal/Brown", "Gray/Black", "Navy/Brown"],
        features: "Water-resistant, heat-resistant, noise-dampening"
      }
    },
    images: [
      "https://m.media-amazon.com/images/I/71OVRLTplcL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71j55Dyr-xL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71xvYBmUV-L._AC_SX679_.jpg"
    ],
    variations: {},
    category: "office-supplies",
    subcategory: "desk-accessories"
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

// Mock related products
export const mockRelatedProducts: RelatedProduct[] = [
  {
    id: 1,
    productId: 1,
    relatedProductId: 2,
    relationshipType: "frequently-bought-together"
  },
  {
    id: 2,
    productId: 1,
    relatedProductId: 4,
    relationshipType: "similar-product"
  },
  {
    id: 3,
    productId: 2,
    relatedProductId: 1,
    relationshipType: "frequently-bought-together"
  },
  {
    id: 4,
    productId: 2,
    relatedProductId: 4,
    relationshipType: "similar-product"
  },
  {
    id: 5,
    productId: 3,
    relatedProductId: 5,
    relationshipType: "frequently-bought-together"
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

// Mock cart items
export const mockCartItems: (CartItem & { product: Product })[] = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    addedAt: "2023-09-20T10:15:00Z",
    product: mockProducts[0]
  },
  {
    id: 2,
    userId: 1,
    productId: 3,
    quantity: 3,
    addedAt: "2023-09-20T10:20:00Z",
    product: mockProducts[2]
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