import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Customer, Order, Expense, User, DashboardStats } from '../types';
import { mockProducts, mockCustomers, mockOrders, mockExpenses, mockUser } from '../data/mockData';

interface AppContextType {
  // Data
  products: Product[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  user: User;
  
  // Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  
  // Dashboard stats
  getDashboardStats: () => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user] = useState<User>(mockUser);

  // Load data from localStorage or use mock data
  useEffect(() => {
    const storedProducts = localStorage.getItem('crm_products');
    const storedCustomers = localStorage.getItem('crm_customers');
    const storedOrders = localStorage.getItem('crm_orders');
    const storedExpenses = localStorage.getItem('crm_expenses');

    setProducts(storedProducts ? JSON.parse(storedProducts) : mockProducts);
    setCustomers(storedCustomers ? JSON.parse(storedCustomers) : mockCustomers);
    setOrders(storedOrders ? JSON.parse(storedOrders) : mockOrders);
    setExpenses(storedExpenses ? JSON.parse(storedExpenses) : mockExpenses);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('crm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('crm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (expenses.length > 0) localStorage.setItem('crm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Product actions
  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  // Customer actions
  const addCustomer = (customer: Customer) => setCustomers(prev => [...prev, customer]);
  const updateCustomer = (customer: Customer) => setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  const deleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));

  // Order actions
  const addOrder = (order: Order) => setOrders(prev => [...prev, order]);
  const updateOrder = (order: Order) => setOrders(prev => prev.map(o => o.id === order.id ? order : o));
  const deleteOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));

  // Expense actions
  const addExpense = (expense: Expense) => setExpenses(prev => [...prev, expense]);
  const updateExpense = (expense: Expense) => setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  // Calculate dashboard stats
  const getDashboardStats = (): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.orderDate);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;

    const lowStockProducts = products.filter(p => p.stock <= 10);

    let totalSales = 0;
    let totalCost = 0;

    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.status !== 'returned') {
        order.items.forEach(item => {
          totalSales += item.unitPrice * item.quantity;
          totalCost += item.costPrice * item.quantity;
        });
        totalSales += order.shippingCost;
        totalSales -= order.discount;
      }
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalSales - totalCost;
    const netProfit = totalProfit - totalExpenses;

    let todayProfit = 0;
    todayOrders.forEach(order => {
      if (order.status !== 'cancelled' && order.status !== 'returned') {
        order.items.forEach(item => {
          todayProfit += (item.unitPrice - item.costPrice) * item.quantity;
        });
        todayProfit -= order.discount;
      }
    });

    return {
      todayOrders: todayOrders.length,
      todayProfit,
      pendingOrders,
      lowStockProducts,
      totalSales,
      totalProfit,
      totalExpenses,
      netProfit
    };
  };

  return (
    <AppContext.Provider value={{
      products,
      customers,
      orders,
      expenses,
      user,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addOrder,
      updateOrder,
      deleteOrder,
      addExpense,
      updateExpense,
      deleteExpense,
      getDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
