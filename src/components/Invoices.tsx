import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Invoice } from '../types';
import { paymentLabels } from '../data/mockData';
import {
  FileText,
  Download,
  Printer,
  Share2,
  X,
  Eye
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoicesProps {
  pendingOrder: Order | null;
  onClearPending: () => void;
}

export function Invoices({ pendingOrder, onClearPending }: InvoicesProps) {
  const { customers } = useApp();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Create invoice from pending order
  if (pendingOrder && !invoices.find(inv => inv.orderId === pendingOrder.id)) {
    const customer = customers.find(c => c.id === pendingOrder.customerId);
    const subtotal = pendingOrder.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
      orderId: pendingOrder.id,
      customerName: pendingOrder.customerName,
      customerPhone: customer?.phone || '',
      customerAddress: customer ? `${customer.city} - ${customer.address}` : '',
      items: pendingOrder.items,
      subtotal,
      discount: pendingOrder.discount,
      shippingCost: pendingOrder.shippingCost,
      total: subtotal + pendingOrder.shippingCost - pendingOrder.discount,
      paymentMethod: pendingOrder.paymentMethod,
      createdAt: new Date()
    };
    
    setInvoices([...invoices, newInvoice]);
    setViewingInvoice(newInvoice);
    setShowViewModal(true);
    onClearPending();
  }

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`فاتورة-${viewingInvoice?.invoiceNumber}.pdf`);
  };

  const printInvoice = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    if (!viewingInvoice) return;
    const message = encodeURIComponent(
      `فاتورة رقم: ${viewingInvoice.invoiceNumber}\n` +
      `العميل: ${viewingInvoice.customerName}\n` +
      `الإجمالي: ${viewingInvoice.total} ج.م\n` +
      `شكراً لتعاملكم معنا 💕`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">الفواتير</h2>
            <p className="text-gray-500 text-sm">{invoices.length} فاتورة</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">نظام الفواتير</h3>
            <p className="text-gray-600 text-sm">
              يمكنك إنشاء فاتورة لأي طلب من صفحة الطلبات بالضغط على أيقونة الفاتورة.
              الفواتير تتضمن جميع تفاصيل الطلب ويمكن تحميلها كـ PDF أو مشاركتها عبر واتساب.
            </p>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">رقم الفاتورة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">العميل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الإجمالي</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">طريقة الدفع</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">التاريخ</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-gray-100 hover:bg-pink-50/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-4 text-gray-600">{invoice.customerName}</td>
                    <td className="py-4 px-4 font-bold text-green-600">{invoice.total.toLocaleString()} ج.م</td>
                    <td className="py-4 px-4 text-gray-600">{paymentLabels[invoice.paymentMethod]}</td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {new Date(invoice.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => { setViewingInvoice(invoice); setShowViewModal(true); }}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700"
                      >
                        <Eye size={16} />
                        <span>عرض</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-12 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 mb-2">لا توجد فواتير بعد</p>
          <p className="text-gray-400 text-sm">قم بإنشاء فاتورة من صفحة الطلبات</p>
        </div>
      )}

      {/* Invoice View Modal */}
      {showViewModal && viewingInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="sticky top-0 bg-white p-4 border-b border-pink-100 flex items-center justify-between no-print">
              <h3 className="text-lg font-bold text-gray-800">فاتورة {viewingInvoice.invoiceNumber}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">تحميل PDF</span>
                </button>
                <button
                  onClick={printInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Printer size={18} />
                  <span className="hidden sm:inline">طباعة</span>
                </button>
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">واتساب</span>
                </button>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 p-2">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Invoice Content */}
            <div ref={invoiceRef} className="p-8 bg-white" dir="rtl">
              {/* Header */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-pink-200">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">L</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">لانجري ستور</h1>
                      <p className="text-gray-500">Lingerie Store</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">القاهرة، مصر</p>
                  <p className="text-sm text-gray-500">هاتف: 01000000000</p>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold text-pink-600 mb-2">فاتورة</h2>
                  <p className="text-sm text-gray-600">رقم: {viewingInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">
                    التاريخ: {new Date(viewingInvoice.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-8 p-4 bg-pink-50 rounded-xl">
                <h3 className="font-bold text-gray-700 mb-2">بيانات العميل</h3>
                <p className="text-gray-800 font-medium">{viewingInvoice.customerName}</p>
                <p className="text-gray-600 text-sm">{viewingInvoice.customerPhone}</p>
                <p className="text-gray-600 text-sm">{viewingInvoice.customerAddress}</p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="text-right py-3 px-4 font-medium text-gray-700">المنتج</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">الكمية</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">السعر</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-pink-100">
                      <td className="py-3 px-4 text-gray-800">{item.productName}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{item.unitPrice} ج.م</td>
                      <td className="py-3 px-4 text-left font-medium text-gray-800">
                        {item.unitPrice * item.quantity} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي</span>
                    <span>{viewingInvoice.subtotal} ج.م</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>الشحن</span>
                    <span>{viewingInvoice.shippingCost} ج.م</span>
                  </div>
                  {viewingInvoice.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>الخصم</span>
                      <span>-{viewingInvoice.discount} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t-2 border-pink-200">
                    <span>الإجمالي</span>
                    <span>{viewingInvoice.total} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600">
                  <span className="font-medium">طريقة الدفع:</span> {paymentLabels[viewingInvoice.paymentMethod]}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-pink-600 font-medium mb-1">شكراً لتعاملكم معنا 💕</p>
                <p className="text-gray-500 text-sm">نتمنى أن تكونوا راضين عن منتجاتنا</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
