import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { categoryLabels } from '../data/mockData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X
} from 'lucide-react';

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'lingerie' as Product['category'],
    size: '',
    color: '',
    sku: '',
    stock: 0,
    costPrice: 0,
    sellingPrice: 0,
    image: '',
    notes: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchTerm) || product.sku.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        size: product.size,
        color: product.color,
        sku: product.sku,
        stock: product.stock,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        image: product.image,
        notes: product.notes
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'lingerie',
        size: '',
        color: '',
        sku: '',
        stock: 0,
        costPrice: 0,
        sellingPrice: 0,
        image: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData
      });
    } else {
      addProduct({
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">المنتجات</h2>
            <p className="text-gray-500 text-sm">{products.length} منتج</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all"
        >
          <Plus size={20} />
          <span>إضافة منتج</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
          >
            <option value="all">جميع الفئات</option>
            <option value="lingerie">لانجري</option>
            <option value="pajamas">بيجامات</option>
            <option value="sets">أطقم</option>
            <option value="accessories">إكسسوارات</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="relative h-48 bg-gradient-to-br from-pink-50 to-rose-50">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="text-pink-200" size={48} />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {categoryLabels[product.category]}
                </span>
              </div>
              {product.stock <= 10 && (
                <div className="absolute top-3 right-3">
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    مخزون منخفض
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-pink-50"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">SKU: {product.sku}</p>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">المقاس: {product.size}</span>
                <span className="text-gray-500">اللون: {product.color}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">سعر البيع</p>
                  <p className="text-lg font-bold text-pink-600">{product.sellingPrice} ج.م</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">الربح</p>
                  <p className="text-lg font-bold text-green-600">
                    {product.sellingPrice - product.costPrice} ج.م
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">المخزون</span>
                  <span className={`font-bold ${product.stock <= 10 ? 'text-amber-600' : 'text-gray-800'}`}>
                    {product.stock} قطعة
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500">لا توجد منتجات</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-6 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  >
                    <option value="lingerie">لانجري</option>
                    <option value="pajamas">بيجامات</option>
                    <option value="sets">أطقم</option>
                    <option value="accessories">إكسسوارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كود المنتج (SKU)</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المقاس</label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                  <input
                    type="text"
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الكمية بالمخزون</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سعر التكلفة</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سعر البيع</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                    placeholder="https://..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                  />
                </div>
              </div>
              
              {formData.costPrice > 0 && formData.sellingPrice > 0 && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">الربح المتوقع للقطعة:</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formData.sellingPrice - formData.costPrice} ج.م
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
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
