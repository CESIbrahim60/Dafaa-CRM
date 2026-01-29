import { Product, Customer, Order, Expense, User } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'طقم لانجري دانتيل أسود',
    category: 'lingerie',
    size: 'M',
    color: 'أسود',
    sku: 'LNG-001',
    stock: 25,
    costPrice: 150,
    sellingPrice: 299,
    image: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=200',
    notes: 'منتج مميز - الأكثر مبيعاً',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'بيجامة ستان وردي',
    category: 'pajamas',
    size: 'L',
    color: 'وردي',
    sku: 'PJM-001',
    stock: 18,
    costPrice: 120,
    sellingPrice: 249,
    image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=200',
    notes: '',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'طقم لانجري أحمر مع روب',
    category: 'sets',
    size: 'S',
    color: 'أحمر',
    sku: 'SET-001',
    stock: 5,
    costPrice: 200,
    sellingPrice: 399,
    image: 'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=200',
    notes: 'مخزون منخفض',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'بيجامة قطن مريحة',
    category: 'pajamas',
    size: 'XL',
    color: 'بيج',
    sku: 'PJM-002',
    stock: 30,
    costPrice: 80,
    sellingPrice: 179,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200',
    notes: '',
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    name: 'لانجري دانتيل أبيض عروس',
    category: 'lingerie',
    size: 'M',
    color: 'أبيض',
    sku: 'LNG-002',
    stock: 12,
    costPrice: 180,
    sellingPrice: 349,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=200',
    notes: 'مناسب للعرائس',
    createdAt: new Date('2024-02-15')
  },
  {
    id: '6',
    name: 'روب ستان طويل',
    category: 'accessories',
    size: 'L',
    color: 'عنابي',
    sku: 'ACC-001',
    stock: 8,
    costPrice: 100,
    sellingPrice: 199,
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200',
    notes: '',
    createdAt: new Date('2024-02-20')
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    fullName: 'سارة محمد أحمد',
    phone: '01012345678',
    address: 'شارع التحرير، المعادي',
    city: 'القاهرة',
    totalOrders: 5,
    totalSpent: 1499,
    notes: 'VIP - عميلة مميزة',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    fullName: 'نورا علي حسن',
    phone: '01198765432',
    address: 'شارع الهرم',
    city: 'الجيزة',
    totalOrders: 3,
    totalSpent: 897,
    notes: '',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    fullName: 'مريم خالد عبدالله',
    phone: '01234567890',
    address: 'سيدي جابر',
    city: 'الإسكندرية',
    totalOrders: 7,
    totalSpent: 2198,
    notes: 'عميلة متكررة - تفضل الألوان الداكنة',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    fullName: 'هدى أحمد سعيد',
    phone: '01087654321',
    address: 'شارع الملك فيصل',
    city: 'الجيزة',
    totalOrders: 2,
    totalSpent: 548,
    notes: '',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    fullName: 'فاطمة محمود حسين',
    phone: '01156789012',
    address: 'مدينة نصر',
    city: 'القاهرة',
    totalOrders: 4,
    totalSpent: 1196,
    notes: 'تفضل المقاسات الكبيرة',
    createdAt: new Date('2024-02-10')
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: '1',
    customerName: 'سارة محمد أحمد',
    items: [
      { productId: '1', productName: 'طقم لانجري دانتيل أسود', quantity: 1, unitPrice: 299, costPrice: 150 },
      { productId: '6', productName: 'روب ستان طويل', quantity: 1, unitPrice: 199, costPrice: 100 }
    ],
    status: 'delivered',
    orderDate: new Date('2024-03-01'),
    shippingMethod: 'standard',
    shippingCost: 50,
    paymentMethod: 'cash',
    discount: 0,
    notes: ''
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: '2',
    customerName: 'نورا علي حسن',
    items: [
      { productId: '2', productName: 'بيجامة ستان وردي', quantity: 2, unitPrice: 249, costPrice: 120 }
    ],
    status: 'shipped',
    orderDate: new Date('2024-03-05'),
    shippingMethod: 'express',
    shippingCost: 75,
    paymentMethod: 'transfer',
    discount: 50,
    notes: 'شحن سريع مطلوب'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: '3',
    customerName: 'مريم خالد عبدالله',
    items: [
      { productId: '3', productName: 'طقم لانجري أحمر مع روب', quantity: 1, unitPrice: 399, costPrice: 200 },
      { productId: '5', productName: 'لانجري دانتيل أبيض عروس', quantity: 1, unitPrice: 349, costPrice: 180 }
    ],
    status: 'processing',
    orderDate: new Date('2024-03-10'),
    shippingMethod: 'standard',
    shippingCost: 50,
    paymentMethod: 'online',
    discount: 0,
    notes: 'هدية زفاف'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerId: '4',
    customerName: 'هدى أحمد سعيد',
    items: [
      { productId: '4', productName: 'بيجامة قطن مريحة', quantity: 3, unitPrice: 179, costPrice: 80 }
    ],
    status: 'new',
    orderDate: new Date(),
    shippingMethod: 'pickup',
    shippingCost: 0,
    paymentMethod: 'cash',
    discount: 30,
    notes: 'استلام من المحل'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerId: '5',
    customerName: 'فاطمة محمود حسين',
    items: [
      { productId: '1', productName: 'طقم لانجري دانتيل أسود', quantity: 2, unitPrice: 299, costPrice: 150 }
    ],
    status: 'new',
    orderDate: new Date(),
    shippingMethod: 'standard',
    shippingCost: 50,
    paymentMethod: 'transfer',
    discount: 0,
    notes: ''
  }
];

export const mockExpenses: Expense[] = [
  { id: '1', type: 'advertising', amount: 500, date: new Date('2024-03-01'), notes: 'إعلانات فيسبوك' },
  { id: '2', type: 'packaging', amount: 200, date: new Date('2024-03-05'), notes: 'أكياس وعلب تغليف' },
  { id: '3', type: 'shipping', amount: 300, date: new Date('2024-03-10'), notes: 'تكاليف شحن إضافية' },
  { id: '4', type: 'photography', amount: 400, date: new Date('2024-03-12'), notes: 'تصوير منتجات جديدة' },
  { id: '5', type: 'operational', amount: 150, date: new Date('2024-03-15'), notes: 'مصاريف إدارية' }
];

export const mockUser: User = {
  id: '1',
  name: 'أميرة محمد',
  email: 'admin@lingerie-store.com',
  role: 'admin'
};

export const categoryLabels: Record<string, string> = {
  lingerie: 'لانجري',
  pajamas: 'بيجامات',
  sets: 'أطقم',
  accessories: 'إكسسوارات'
};

export const statusLabels: Record<string, string> = {
  new: 'جديد',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  returned: 'مرتجع'
};

export const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700'
};

export const paymentLabels: Record<string, string> = {
  cash: 'كاش',
  transfer: 'تحويل بنكي',
  online: 'دفع إلكتروني'
};

export const shippingLabels: Record<string, string> = {
  standard: 'شحن عادي',
  express: 'شحن سريع',
  pickup: 'استلام من المحل'
};

export const expenseLabels: Record<string, string> = {
  shipping: 'شحن',
  advertising: 'إعلانات',
  packaging: 'تغليف',
  photography: 'تصوير',
  operational: 'مصاريف تشغيلية',
  other: 'أخرى'
};
