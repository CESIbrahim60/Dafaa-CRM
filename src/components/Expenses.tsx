import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Expense, ExpenseType } from '../types';
import { expenseLabels } from '../data/mockData';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Receipt,
  X,
  Calendar,
  TrendingDown
} from 'lucide-react';

export function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    type: 'operational' as ExpenseType,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.notes?.includes(searchTerm) || expenseLabels[expense.type].includes(searchTerm);
    const matchesType = typeFilter === 'all' || expense.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const expensesByType = Object.keys(expenseLabels).map(type => ({
    type,
    label: expenseLabels[type],
    total: expenses.filter(e => e.type === type).reduce((sum, e) => sum + e.amount, 0)
  })).filter(e => e.total > 0);

  const openModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        type: expense.type,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
        notes: expense.notes
      });
    } else {
      setEditingExpense(null);
      setFormData({
        type: 'operational',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense({
        ...editingExpense,
        ...formData,
        date: new Date(formData.date)
      });
    } else {
      addExpense({
        id: Date.now().toString(),
        ...formData,
        date: new Date(formData.date)
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      deleteExpense(id);
    }
  };

  const typeColors: Record<string, string> = {
    shipping: 'bg-blue-100 text-blue-700',
    advertising: 'bg-purple-100 text-purple-700',
    packaging: 'bg-amber-100 text-amber-700',
    photography: 'bg-pink-100 text-pink-700',
    operational: 'bg-gray-100 text-gray-700',
    other: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center">
            <Receipt className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">المصروفات</h2>
            <p className="text-gray-500 text-sm">{expenses.length} مصروف</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all"
        >
          <Plus size={20} />
          <span>إضافة مصروف</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} ج.م</p>
            </div>
          </div>
        </div>
        
        {expensesByType.slice(0, 3).map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800">{item.total.toLocaleString()} ج.م</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                {Math.round((item.total / totalExpenses) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث في المصروفات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400"
          >
            <option value="all">جميع الأنواع</option>
            {Object.entries(expenseLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">النوع</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">المبلغ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">التاريخ</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">ملاحظات</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-gray-100 hover:bg-pink-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[expense.type]}`}>
                      {expenseLabels[expense.type]}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-red-600">{expense.amount.toLocaleString()} ج.م</td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(expense.date).toLocaleDateString('ar-EG')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{expense.notes || '-'}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(expense)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">لا توجد مصروفات</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-6 border-b border-pink-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {editingExpense ? 'تعديل المصروف' : 'إضافة مصروف جديد'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المصروف</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ExpenseType })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400"
                >
                  {Object.entries(expenseLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400"
                  placeholder="وصف المصروف..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {editingExpense ? 'حفظ التعديلات' : 'إضافة المصروف'}
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
