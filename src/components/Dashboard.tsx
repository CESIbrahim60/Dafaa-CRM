import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight
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
  Bar
} from 'recharts';
import { statusLabels, statusColors } from '../data/mockData';

export function Dashboard() {
  const { getDashboardStats, orders, products, customers } = useApp();
  const stats = getDashboardStats();

  // Prepare chart data
  const salesByDay = [
    { day: 'السبت', sales: 1200, profit: 450 },
    { day: 'الأحد', sales: 1800, profit: 680 },
    { day: 'الإثنين', sales: 1400, profit: 520 },
    { day: 'الثلاثاء', sales: 2200, profit: 890 },
    { day: 'الأربعاء', sales: 1600, profit: 610 },
    { day: 'الخميس', sales: 2800, profit: 1100 },
    { day: 'الجمعة', sales: 3200, profit: 1350 },
  ];

  const ordersByStatus = [
    { name: 'جديد', value: orders.filter(o => o.status === 'new').length, color: '#3B82F6' },
    { name: 'قيد التجهيز', value: orders.filter(o => o.status === 'processing').length, color: '#F59E0B' },
    { name: 'تم الشحن', value: orders.filter(o => o.status === 'shipped').length, color: '#8B5CF6' },
    { name: 'تم التسليم', value: orders.filter(o => o.status === 'delivered').length, color: '#10B981' },
  ];

  const topProducts = products
    .map(p => ({
      name: p.name.substring(0, 20),
      profit: p.sellingPrice - p.costPrice,
      sales: Math.floor(Math.random() * 50) + 10
    }))
    .slice(0, 5);

  const statCards = [
    {
      title: 'طلبات اليوم',
      value: stats.todayOrders,
      icon: ShoppingCart,
      color: 'from-blue-400 to-blue-600',
      change: '+12%',
      positive: true
    },
    {
      title: 'أرباح اليوم',
      value: `${stats.todayProfit.toLocaleString()} ج.م`,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      change: '+8%',
      positive: true
    },
    {
      title: 'طلبات معلقة',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-amber-400 to-orange-500',
      change: '-5%',
      positive: false
    },
    {
      title: 'مخزون منخفض',
      value: stats.lowStockProducts.length,
      icon: AlertTriangle,
      color: 'from-red-400 to-rose-500',
      change: '+2',
      positive: false
    }
  ];

  const summaryCards = [
    { title: 'إجمالي المبيعات', value: stats.totalSales, icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { title: 'إجمالي الأرباح', value: stats.totalProfit, icon: TrendingUp, color: 'text-blue-600 bg-blue-100' },
    { title: 'إجمالي المصروفات', value: stats.totalExpenses, icon: ArrowDownRight, color: 'text-red-600 bg-red-100' },
    { title: 'صافي الربح', value: stats.netProfit, icon: ArrowUpRight, color: 'text-purple-600 bg-purple-100' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-pink-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${card.positive ? 'text-green-600' : 'text-red-500'}`}>
                    {card.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{card.change}</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-pink-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{card.title}</p>
                  <p className="text-lg font-bold text-gray-800">{card.value.toLocaleString()} ج.م</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">المبيعات والأرباح الأسبوعية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesByDay}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} ج.م`]}
              />
              <Area type="monotone" dataKey="sales" stroke="#EC4899" fillOpacity={1} fill="url(#colorSales)" name="المبيعات" />
              <Area type="monotone" dataKey="profit" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProfit)" name="الأرباح" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">الطلبات حسب الحالة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} طلب`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {ordersByStatus.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">المنتجات الأكثر ربحاً</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value} ج.م`, 'الربح']} />
              <Bar dataKey="profit" fill="#EC4899" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            تنبيه المخزون المنخفض
          </h3>
          <div className="space-y-3">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا توجد منتجات بمخزون منخفض</p>
            ) : (
              stats.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.stock} قطعة
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">آخر الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">رقم الطلب</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">العميل</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => {
                const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + order.shippingCost - order.discount;
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-pink-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-gray-600">{order.customerName}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{total.toLocaleString()} ج.م</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
          <Package className="mb-2" size={24} />
          <p className="text-pink-100 text-sm">عدد المنتجات</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
          <Users className="mb-2" size={24} />
          <p className="text-purple-100 text-sm">عدد العملاء</p>
          <p className="text-3xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <ShoppingCart className="mb-2" size={24} />
          <p className="text-blue-100 text-sm">إجمالي الطلبات</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
          <TrendingUp className="mb-2" size={24} />
          <p className="text-emerald-100 text-sm">متوسط قيمة الطلب</p>
          <p className="text-3xl font-bold">
            {orders.length > 0 
              ? Math.round(stats.totalSales / orders.length).toLocaleString()
              : 0} ج.م
          </p>
        </div>
      </div>
    </div>
  );
}
