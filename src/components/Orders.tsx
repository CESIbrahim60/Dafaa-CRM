import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderItem, OrderStatus } from '../types';
import { statusLabels, statusColors, paymentLabels, shippingLabels } from '../data/mockData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingCart,
  X,
  Eye,
  FileText
} from 'lucide-react';

interface OrdersProps {
  onCreateInvoice: (order: Order) => void;
}

export function Orders({ onCreateInvoice }: OrdersProps) {
  const { orders, customers, products, addOrder, updateOrder, deleteOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    items: [] as OrderItem[],
    status: 'new' as OrderStatus,
    shippingMethod: 'standard' as Order['shippingMethod'],
    shippingCost: 50,
    paymentMethod: 'cash' as Order['paymentMethod'],
    discount: 0,
    notes: ''
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.includes(searchTerm) || order.customerName.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateOrderTotal = (items: OrderItem[], shippingCost: number, discount: number) => {
    const itemsTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return itemsTotal + shippingCost - discount;
  };

  const calculateOrderProfit = (items: OrderItem[], discount: number) => {
    return items.reduce((sum, item) => sum + (item.unitPrice - item.costPrice) * item.quantity, 0) - discount;
  };

  const openModal = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customerId: order.customerId,
        items: order.items,
        status: order.status,
        shippingMethod: order.shippingMethod,
        shippingCost: order.shippingCost,
        paymentMethod: order.paymentMethod,
        discount: order.discount,
        notes: order.notes
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customerId: '',
        items: [],
        status: 'new',
        shippingMethod: 'standard',
        shippingCost: 50,
        paymentMethod: 'cash',
        discount: 0,
        notes: ''
      });
    }
    setShowModal(true);
  };

  const addProductToOrder = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = formData.items.find(item => item.productId === selectedProduct);
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + productQuantity }
            : item
        )
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, {
          productId: product.id,
          productName: product.name,
          quantity: productQuantity,
          unitPrice: product.sellingPrice,
          costPrice: product.costPrice
        }]
      });
    }
    setSelectedProduct('');
    setProductQuantity(1);
  };

  const removeProductFromOrder = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId !== productId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    if (editingOrder) {
      updateOrder({
        ...editingOrder,
        ...formData,
        customerName: customer.fullName
      });
    } else {
      addOrder({
        id: Date.now().toString(),
        orderNumber: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        ...formData,
        customerName: customer.fullName,
        orderDate: new Date()
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      deleteOrder(id);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateOrder({ ...order, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <ShoppingCart className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">الطلبات</h2>
            <p className="text-gray-500 text-sm">{orders.length} طلب</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all"
        >
          <Plus size={20} />
          <span>طلب جديد</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث برقم الطلب أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="all">جميع الحالات</option>
            <option value="new">جديد</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
            <option value="returned">مرتجع</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">رقم الطلب</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">العميل</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">المنتجات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الإجمالي</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الربح</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الحالة</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">التاريخ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const total = calculateOrderTotal(order.items, order.shippingCost, order.discount);
                const profit = calculateOrderProfit(order.items, order.discount);
                return (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-pink-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800">{order.orderNumber}</td>
                    <td className="py-4 px-4 text-gray-600">{order.customerName}</td>
                    <td className="py-4 px-4 text-gray-600">{order.items.length} منتج</td>
                    <td className="py-4 px-4 font-medium text-gray-800">{total.toLocaleString()} ج.م</td>
                    <td className="py-4 px-4 font-medium text-green-600">{profit.toLocaleString()} ج.م</td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        <option value="new">جديد</option>
                        <option value="processing">قيد التجهيز</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                        <option value="returned">مرتجع</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setViewingOrder(order); setShowViewModal(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal(order)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onCreateInvoice(order)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                          title="إنشاء فاتورة"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-6 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingOrder ? 'تعديل الطلب' : 'إضافة طلب جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="">اختر العميل</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.fullName} - {customer.phone}</option>
                  ))}
                </select>
              </div>

              {/* Add Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">إضافة منتجات</label>
                <div className="flex gap-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  >
                    <option value="">اختر منتج</option>
                    {products.filter(p => p.stock > 0).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sellingPrice} ج.م (متوفر: {product.stock})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-3 border border-gray-200 rounded-xl text-center"
                  />
                  <button
                    type="button"
                    onClick={addProductToOrder}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              {formData.items.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-700 mb-3">المنتجات المطلوبة</h4>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-500">{item.unitPrice} ج.م × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-800">{item.unitPrice * item.quantity} ج.م</span>
                          <button
                            type="button"
                            onClick={() => removeProductFromOrder(item.productId)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الشحن</label>
                  <select
                    value={formData.shippingMethod}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      shippingMethod: e.target.value as Order['shippingMethod'],
                      shippingCost: e.target.value === 'pickup' ? 0 : e.target.value === 'express' ? 75 : 50
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="standard">شحن عادي (50 ج.م)</option>
                    <option value="express">شحن سريع (75 ج.م)</option>
                    <option value="pickup">استلام من المحل (مجاني)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Order['paymentMethod'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="cash">كاش عند الاستلام</option>
                    <option value="transfer">تحويل بنكي</option>
                    <option value="online">دفع إلكتروني</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الخصم</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  >
                    <option value="new">جديد</option>
                    <option value="processing">قيد التجهيز</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التسليم</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Order Summary */}
              {formData.items.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>المنتجات</span>
                      <span>{formData.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>الشحن</span>
                      <span>{formData.shippingCost} ج.م</span>
                    </div>
                    {formData.discount > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>الخصم</span>
                        <span>-{formData.discount} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-blue-200">
                      <span>الإجمالي</span>
                      <span>{calculateOrderTotal(formData.items, formData.shippingCost, formData.discount)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>الربح المتوقع</span>
                      <span>{calculateOrderProfit(formData.items, formData.discount)} ج.م</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formData.items.length === 0 || !formData.customerId}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingOrder ? 'حفظ التعديلات' : 'إنشاء الطلب'}
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

      {/* View Order Modal */}
      {showViewModal && viewingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-6 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">رقم الطلب</span>
                <span className="font-bold">{viewingOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">العميل</span>
                <span className="font-medium">{viewingOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">الحالة</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[viewingOrder.status]}`}>
                  {statusLabels[viewingOrder.status]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">طريقة الشحن</span>
                <span>{shippingLabels[viewingOrder.shippingMethod]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">طريقة الدفع</span>
                <span>{paymentLabels[viewingOrder.paymentMethod]}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-700 mb-3">المنتجات</h4>
                {viewingOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-50">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-medium">{item.unitPrice * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>{viewingOrder.shippingCost} ج.م</span>
                </div>
                {viewingOrder.discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>الخصم</span>
                    <span>-{viewingOrder.discount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>الإجمالي</span>
                  <span>{calculateOrderTotal(viewingOrder.items, viewingOrder.shippingCost, viewingOrder.discount)} ج.م</span>
                </div>
              </div>

              <button
                onClick={() => { setShowViewModal(false); onCreateInvoice(viewingOrder); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:shadow-lg transition-all"
              >
                <FileText size={20} />
                <span>إنشاء فاتورة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
