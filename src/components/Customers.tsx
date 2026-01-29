import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  X,
  Phone,
  MapPin,
  ShoppingBag,
  Star
} from 'lucide-react';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.includes(searchTerm) || customer.phone.includes(searchTerm)
  );

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        fullName: customer.fullName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        notes: customer.notes
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        ...formData
      });
    } else {
      addCustomer({
        id: Date.now().toString(),
        ...formData,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date()
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">العملاء</h2>
            <p className="text-gray-500 text-sm">{customers.length} عميل</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
        >
          <Plus size={20} />
          <span>إضافة عميل</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {customer.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{customer.fullName}</h3>
                  {customer.notes?.includes('VIP') && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Star size={12} />
                      VIP
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(customer)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm" dir="ltr">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-sm">{customer.city} - {customer.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-purple-500" />
                <span className="text-sm text-gray-600">{customer.totalOrders} طلب</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">إجمالي المشتريات</p>
                <p className="font-bold text-purple-600">{customer.totalSpent.toLocaleString()} ج.م</p>
              </div>
            </div>

            {customer.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500">لا يوجد عملاء</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-6 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة / المحافظة</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="مثال: VIP، عميلة متكررة، تفضيلات خاصة..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {editingCustomer ? 'حفظ التعديلات' : 'إضافة العميل'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
