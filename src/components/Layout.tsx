import { ReactNode, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Receipt,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'products', label: 'المنتجات', icon: Package },
  { id: 'customers', label: 'العملاء', icon: Users },
  { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
  { id: 'expenses', label: 'المصروفات', icon: Receipt },
  { id: 'invoices', label: 'الفواتير', icon: FileText },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-pink-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">لانجري ستور</h1>
                <p className="text-xs text-gray-500">نظام إدارة العملاء</p>
              </div>
            </div>
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-l from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-pink-100 bg-white">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 text-right">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'admin' ? 'مدير النظام' : 'موظف'}
                </p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 text-gray-600">
                  <Settings size={18} />
                  <span>الإعدادات</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 text-red-500">
                  <LogOut size={18} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:mr-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-pink-100">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              className="lg:hidden text-gray-600 hover:text-pink-500 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800">
              {menuItems.find(m => m.id === currentPage)?.label || 'لوحة التحكم'}
            </h2>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-left">
                <p className="text-sm text-gray-500">مرحباً</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center lg:hidden">
                <span className="text-white font-bold">{user.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
