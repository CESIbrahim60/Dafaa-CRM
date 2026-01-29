import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { categoryLabels } from '../data/mockData';

export function Reports() {
  const { orders, products, customers, expenses } = useApp();

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'cancelled' && order.status !== 'returned') {
      return sum + order.items.reduce((s, item) => s + item.unitPrice * item.quantity, 0) + order.shippingCost - order.discount;
    }
    return sum;
  }, 0);

  const totalCost = orders.reduce((sum, order) => {
    if (order.status !== 'cancelled' && order.status !== 'returned') {
      return sum + order.items.reduce((s, item) => s + item.costPrice * item.quantity, 0);
    }
    return sum;
  }, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Monthly sales data
  const monthlySales = [
    { month: 'يناير', sales: 12500, profit: 4500, expenses: 1200 },
    { month: 'فبراير', sales: 15800, profit: 5800, expenses: 1500 },
    { month: 'مارس', sales: 18200, profit: 6900, expenses: 1800 },
    { month: 'أبريل', sales: 14300, profit: 5200, expenses: 1400 },
    { month: 'مايو', sales: 21500, profit: 8100, expenses: 2100 },
    { month: 'يونيو', sales: 19800, profit: 7400, expenses: 1900 },
  ];

  // Products by category
  const productsByCategory = Object.keys(categoryLabels).map(cat => ({
    name: categoryLabels[cat],
    value: products.filter(p => p.category === cat).length,
    color: cat === 'lingerie' ? '#EC4899' : cat === 'pajamas' ? '#8B5CF6' : cat === 'sets' ? '#3B82F6' : '#10B981'
  }));

  // Orders by status
  const ordersByStatus = [
    { name: 'جديد', value: orders.filter(o => o.status === 'new').length, color: '#3B82F6' },
    { name: 'قيد التجهيز', value: orders.filter(o => o.status === 'processing').length, color: '#F59E0B' },
    { name: 'تم الشحن', value: orders.filter(o => o.status === 'shipped').length, color: '#8B5CF6' },
    { name: 'تم التسليم', value: orders.filter(o => o.status === 'delivered').length, color: '#10B981' },
    { name: 'ملغي/مرتجع', value: orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length, color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Top products by profit
  const topProducts = products
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      profit: p.sellingPrice - p.costPrice,
      stock: p.stock
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 6);

  // Expenses by type
  const expensesByType = [
    { name: 'إعلانات', value: expenses.filter(e => e.type === 'advertising').reduce((s, e) => s + e.amount, 0), color: '#8B5CF6' },
    { name: 'شحن', value: expenses.filter(e => e.type === 'shipping').reduce((s, e) => s + e.amount, 0), color: '#3B82F6' },
    { name: 'تغليف', value: expenses.filter(e => e.type === 'packaging').reduce((s, e) => s + e.amount, 0), color: '#F59E0B' },
    { name: 'تصوير', value: expenses.filter(e => e.type === 'photography').reduce((s, e) => s + e.amount, 0), color: '#EC4899' },
    { name: 'تشغيلية', value: expenses.filter(e => e.type === 'operational').reduce((s, e) => s + e.amount, 0), color: '#6B7280' },
  ].filter(e => e.value > 0);

  // Cities analysis
  const customersByCity = customers.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const citiesData = Object.entries(customersByCity)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Cost vs Selling Price comparison
  const priceComparison = products.slice(0, 5).map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    costPrice: p.costPrice,
    sellingPrice: p.sellingPrice
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h2>
          <p className="text-gray-500 text-sm">تحليل شامل للأداء المالي والتشغيلي</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString()} ج.م</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-blue-600 font-medium">{profitMargin}%</span>
          </div>
          <p className="text-sm text-gray-500">إجمالي الربح</p>
          <p className="text-2xl font-bold text-gray-800">{grossProfit.toLocaleString()} ج.م</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500">إجمالي المصروفات</p>
          <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ج.م</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <p className="text-sm text-gray-500">صافي الربح</p>
          <p className="text-2xl font-bold text-purple-600">{netProfit.toLocaleString()} ج.م</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-4 text-white">
          <Package className="mb-2" size={20} />
          <p className="text-pink-100 text-xs">المنتجات</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
          <Users className="mb-2" size={20} />
          <p className="text-purple-100 text-xs">العملاء</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
          <ShoppingCart className="mb-2" size={20} />
          <p className="text-blue-100 text-xs">الطلبات</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
          <Calendar className="mb-2" size={20} />
          <p className="text-emerald-100 text-xs">متوسط قيمة الطلب</p>
          <p className="text-2xl font-bold">
            {orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">المبيعات والأرباح الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="colorSales2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#EC4899" fillOpacity={1} fill="url(#colorSales2)" name="المبيعات" />
              <Area type="monotone" dataKey="profit" stroke="#10B981" fillOpacity={1} fill="url(#colorProfit2)" name="الأرباح" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع الطلبات حسب الحالة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} طلب`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">أعلى المنتجات ربحاً</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value} ج.م`, 'الربح']} />
              <Bar dataKey="profit" fill="#EC4899" radius={[0, 8, 8, 0]} name="الربح" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع المصروفات</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expensesByType}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {expensesByType.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} ج.م`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {expensesByType.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Price Comparison */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">مقارنة سعر التكلفة وسعر البيع</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={priceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} ج.م`]} />
              <Legend />
              <Bar dataKey="costPrice" fill="#6B7280" name="سعر التكلفة" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sellingPrice" fill="#EC4899" name="سعر البيع" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">المنتجات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={productsByCategory}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {productsByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cities Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع العملاء حسب المدينة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {citiesData.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-pink-600">{item.count}</p>
              <p className="text-sm text-gray-600">{item.city}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">ملخص الأداء</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-pink-100 text-sm mb-1">إجمالي الإيرادات</p>
            <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}</p>
            <p className="text-pink-200 text-sm">ج.م</p>
          </div>
          <div>
            <p className="text-pink-100 text-sm mb-1">إجمالي التكاليف</p>
            <p className="text-3xl font-bold">{totalCost.toLocaleString()}</p>
            <p className="text-pink-200 text-sm">ج.م</p>
          </div>
          <div>
            <p className="text-pink-100 text-sm mb-1">المصروفات التشغيلية</p>
            <p className="text-3xl font-bold">{totalExpenses.toLocaleString()}</p>
            <p className="text-pink-200 text-sm">ج.م</p>
          </div>
          <div>
            <p className="text-pink-100 text-sm mb-1">صافي الربح النهائي</p>
            <p className="text-3xl font-bold">{netProfit.toLocaleString()}</p>
            <p className="text-pink-200 text-sm">ج.م</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-pink-400/30">
          <p className="text-pink-100">
            هامش الربح الإجمالي: <span className="font-bold text-white">{profitMargin}%</span> | 
            متوسط قيمة الطلب: <span className="font-bold text-white">{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0} ج.م</span> |
            عدد الطلبات المكتملة: <span className="font-bold text-white">{orders.filter(o => o.status === 'delivered').length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
