export interface Product {
  id: string;
  name: string;
  category: 'lingerie' | 'pajamas' | 'sets' | 'accessories';
  size: string;
  color: string;
  sku: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  image: string;
  notes: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  notes: string;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMethod = 'cash' | 'transfer' | 'online';
export type ShippingMethod = 'standard' | 'express' | 'pickup';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  orderDate: Date;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  paymentMethod: PaymentMethod;
  discount: number;
  notes: string;
}

export type ExpenseType = 'shipping' | 'advertising' | 'packaging' | 'photography' | 'operational' | 'other';

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  date: Date;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  todayOrders: number;
  todayProfit: number;
  pendingOrders: number;
  lowStockProducts: Product[];
  totalSales: number;
  totalProfit: number;
  totalExpenses: number;
  netProfit: number;
}
