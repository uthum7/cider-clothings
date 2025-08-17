// This file simulates our central database.
// Both the admin panel and customer pages will use this data.

// Import images to be used in products
import shairt1_img from '../assets/shairt1.jpg';
import shairt2_img from '../assets/shairt2.jpg';
import shairt6_img from '../assets/shairt6.webp';
import product4_img from '../assets/product4.jpeg';

export const mockProducts = [
  { id: 1, name: 'Classic Blue Shirt', images: [shairt1_img, shairt2_img], description: 'A timeless staple for any wardrobe.', category: 'Men', price: 45.00, stock: 120, status: 'Active' },
  { id: 2, name: 'Vintage Graphic Hoodie', images: [shairt6_img], description: 'Comfortable and stylish vintage hoodie.', category: 'Women', price: 65.00, stock: 80, status: 'Active' },
  { id: 3, name: 'Slim-Fit Chinos', images: [product4_img], description: 'Versatile and modern slim-fit chinos.', category: 'Men', price: 49.99, stock: 5, status: 'Active' },
  // ... more products
];

export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', joinedDate: '2025-01-15' },
  { id: 2, name: 'Jane Smith (Admin)', email: 'jane.smith@example.com', role: 'Admin', joinedDate: '2024-11-20' },
  // ... more users
];

export const mockOrders = [
  { 
    id: 'WU88191111', 
    customerId: 1, 
    customerName: 'John Doe', 
    date: '2025-07-21', 
    total: 110.00, 
    status: 'Shipped', // Admin can change this
    payment: 'Paid',
    items: [
        { productId: 1, name: 'Classic Blue Shirt', quantity: 1, price: 45.00 },
        { productId: 2, name: 'Vintage Graphic Hoodie', quantity: 1, price: 65.00 },
    ]
  },
  { 
    id: 'WU88191112', 
    customerId: 1, 
    customerName: 'John Doe',
    date: '2025-07-23', 
    total: 49.99, 
    status: 'Processing', // Admin can change this
    payment: 'Paid',
    items: [
        { productId: 3, name: 'Slim-Fit Chinos', quantity: 1, price: 49.99 },
    ]
  },
  // ... more orders
];