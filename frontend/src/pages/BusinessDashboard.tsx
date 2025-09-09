import React, { useState, useEffect } from 'react';

interface DashboardData {
  sales: {
    today: string;
    monthly: string;
    retail: string;
    credit: string;
  };
  stock: {
    branches: string;
    lowStock: string;
    rawMaterial: string;
  };
  purchases: {
    today: string;
    pendingPayments: string;
    expenses: string;
  };
  production: {
    issued: string;
    produced: string;
    wastage: string;
  };
  hr: {
    staff: string;
    leaves: string;
    salaries: string;
  };
  profit: {
    monthly: string;
    weekly: string;
  };
}

interface ItemRow {
  id: number;
  product: string;
  sku: string;
  unit: string;
  qty: number;
  rate: number;
  disc: number;
  tax: number;
  lineTotal: number;
}

interface PaymentRow {
  id: number;
  mode: string;
  ref: string;
  amount: number;
}

const BusinessDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [items, setItems] = useState<ItemRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [nextItemId, setNextItemId] = useState(1);
  const [nextPaymentId, setNextPaymentId] = useState(1);

  // Form states for billing
  const [invoiceData, setInvoiceData] = useState({
    invNo: `INV-${Date.now()}`,
    invDate: new Date().toISOString().slice(0, 16),
    branch: 'Branch A',
    billType: 'retail',
    cashier: 'Logged User',
    taxScope: 'intra',
    custName: '',
    custPhone: '',
    custAddr: '',
    custGST: '',
    custOut: '0.00',
    custLimit: '0.00',
    overallDiscType: 'amt',
    overallDiscVal: 0,
  });

  const [dashboardData] = useState<DashboardData>({
    sales: {
      today: '₹ 15,240.00',
      monthly: '₹ 4,52,100.00',
      retail: '85.00%',
      credit: '15.00%',
    },
    stock: { branches: '1,245', lowStock: '12', rawMaterial: '850' },
    purchases: {
      today: '₹ 8,500.00',
      pendingPayments: '₹ 25,600.00',
      expenses: '₹ 12,300.00',
    },
    production: { issued: '125', produced: '118', wastage: '7' },
    hr: { staff: '15', leaves: '2', salaries: '₹ 1,85,000.00' },
    profit: { monthly: '₹ 87,500.00', weekly: '₹ 22,100.00' },
  });

  const menuItems = {
    dashboard: 'Dashboard',
    'master-setup': 'Master Setup',
    sales: 'Sales',
    purchase: 'Purchase',
    'stock-inventory': 'Stock / Inventory',
    'production-unit': 'Production Unit',
    expenses: 'Expenses',
    accounts: 'Accounts',
    'hr-staff': 'HR / Staff',
  };

  const submenus = {
    'master-setup': [
      'Branch Master',
      'Staff Master',
      'Product Master',
      'Supplier/Creditor Master',
      'Customer Master',
      'Expense Category Master',
      'Machinery Master',
    ],
    sales: [
      'Retail Sales Entry',
      'Credit Sales Entry',
      'Sales Return Entry',
      'Sales Report',
    ],
    purchase: [
      'Purchase Entry',
      'Purchase Return Entry',
      'Pending Creditors Report',
    ],
    'stock-inventory': [
      'Stock Transfer',
      'Stock Adjustment',
      'Current Stock Report',
    ],
    'production-unit': [
      'Raw Material Issue Entry',
      'Production Entry',
      'Wastage Entry',
      'Production Report',
    ],
    expenses: [
      'Expense Entry',
      'Machinery Maintenance Entry',
      'Expense Report',
    ],
    accounts: [
      'Cash/Bank Book',
      'Creditors Outstanding',
      'Debtors Outstanding',
      'Daily Collection Report',
      'Profit & Loss Report',
    ],
    'hr-staff': ['Attendance Entry', 'Salary Entry', 'Staff Report'],
  };

  // Add a default item row on component mount
  useEffect(() => {
    const newItem: ItemRow = {
      id: 1,
      product: '',
      sku: '',
      unit: 'Nos',
      qty: 1,
      rate: 0,
      disc: 0,
      tax: 0,
      lineTotal: 0,
    };
    setItems([newItem]);
    setNextItemId(2);
  }, []);

  const addItemRow = () => {
    const newItem: ItemRow = {
      id: nextItemId,
      product: '',
      sku: '',
      unit: 'Nos',
      qty: 1,
      rate: 0,
      disc: 0,
      tax: 0,
      lineTotal: 0,
    };
    setItems(prev => [...prev, newItem]);
    setNextItemId(prev => prev + 1);
  };

  const addPaymentRow = () => {
    const newPayment: PaymentRow = {
      id: nextPaymentId,
      mode: 'Cash',
      ref: '',
      amount: 0,
    };
    setPayments(prev => [...prev, newPayment]);
    setNextPaymentId(prev => prev + 1);
  };

  const updateItem = (
    id: number,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate line total
          if (field === 'qty' || field === 'rate' || field === 'disc') {
            const qty =
              typeof value === 'number' && field === 'qty'
                ? value
                : updatedItem.qty;
            const rate =
              typeof value === 'number' && field === 'rate'
                ? value
                : updatedItem.rate;
            const disc =
              typeof value === 'number' && field === 'disc'
                ? value
                : updatedItem.disc;

            const subtotal = qty * rate;
            const discountAmount = (subtotal * disc) / 100;
            updatedItem.lineTotal = subtotal - discountAmount;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const updatePayment = (
    id: number,
    field: keyof PaymentRow,
    value: string | number
  ) => {
    setPayments(prev =>
      prev.map(payment => {
        if (payment.id === id) {
          return { ...payment, [field]: value };
        }
        return payment;
      })
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const removePayment = (id: number) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
  };

  const calculateSummary = () => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const totalDiscount = items.reduce(
      (sum, item) => sum + (item.qty * item.rate * item.disc) / 100,
      0
    );
    const overallDisc =
      invoiceData.overallDiscType === 'pct'
        ? (subtotal * invoiceData.overallDiscVal) / 100
        : invoiceData.overallDiscVal;
    const taxableValue = subtotal - totalDiscount - overallDisc;

    let cgst = 0,
      sgst = 0,
      igst = 0;

    if (invoiceData.taxScope === 'intra') {
      const totalTax = items.reduce(
        (sum, item) =>
          sum +
          ((item.qty * item.rate - (item.qty * item.rate * item.disc) / 100) *
            item.tax) /
            100,
        0
      );
      cgst = totalTax / 2;
      sgst = totalTax / 2;
    } else {
      igst = items.reduce(
        (sum, item) =>
          sum +
          ((item.qty * item.rate - (item.qty * item.rate * item.disc) / 100) *
            item.tax) /
            100,
        0
      );
    }

    const netBeforeRound = taxableValue + cgst + sgst + igst;
    const netAmount = Math.round(netBeforeRound);
    const roundOff = netAmount - netBeforeRound;

    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: (totalDiscount + overallDisc).toFixed(2),
      taxableValue: taxableValue.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      roundOff: roundOff.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  const createDashboardSection = (
    title: string,
    dataArray: Array<{ label: string; value: string; color: string }>,
    page: string
  ) => (
    <div className="bg-white rounded-xl shadow-lg p-6" key={title}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => setCurrentPage(page)}
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          View Details
        </button>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${dataArray.length} gap-4`}
      >
        {dataArray.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200"
          >
            <p className={`text-lg font-bold text-${item.color}`}>
              {item.value}
            </p>
            <p className="text-sm text-gray-600 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => {
    const { sales, stock, purchases, production, hr, profit } = dashboardData;

    return (
      <div className="p-8 space-y-8">
        {createDashboardSection(
          'Sales Overview',
          [
            { label: "Today's Sales", value: sales.today, color: 'yellow-500' },
            {
              label: 'Monthly Sales',
              value: sales.monthly,
              color: 'yellow-500',
            },
            {
              label: 'Retail vs Credit',
              value: `${sales.retail} / ${sales.credit}`,
              color: 'yellow-500',
            },
          ],
          'sales'
        )}

        {createDashboardSection(
          'Stock / Inventory',
          [
            {
              label: 'Current Stock (Units)',
              value: stock.branches,
              color: 'green-500',
            },
            {
              label: 'Low Stock Alerts',
              value: stock.lowStock,
              color: 'red-500',
            },
            {
              label: 'Raw Material Stock',
              value: stock.rawMaterial,
              color: 'green-500',
            },
          ],
          'stock-inventory'
        )}

        {createDashboardSection(
          'Purchases & Expenses',
          [
            {
              label: "Today's Purchases",
              value: purchases.today,
              color: 'yellow-500',
            },
            {
              label: 'Pending Payments',
              value: purchases.pendingPayments,
              color: 'red-500',
            },
            {
              label: 'Monthly Expenses',
              value: purchases.expenses,
              color: 'yellow-500',
            },
          ],
          'purchase'
        )}

        {createDashboardSection(
          'Production',
          [
            {
              label: 'Raw Material Issued',
              value: production.issued,
              color: 'indigo-500',
            },
            {
              label: 'Finished Goods Produced',
              value: production.produced,
              color: 'indigo-500',
            },
            {
              label: 'Wastage / Returns',
              value: production.wastage,
              color: 'red-500',
            },
          ],
          'production-unit'
        )}

        {createDashboardSection(
          'Staff / HR',
          [
            { label: 'Total Staff', value: hr.staff, color: 'purple-500' },
            { label: 'Leaves Today', value: hr.leaves, color: 'purple-500' },
            { label: 'Monthly Salaries', value: hr.salaries, color: 'red-500' },
          ],
          'hr-staff'
        )}

        {createDashboardSection(
          'Profit & Loss Snapshot',
          [
            {
              label: 'Monthly Net Profit',
              value: profit.monthly,
              color: 'emerald-500',
            },
            {
              label: 'Weekly Net Profit',
              value: profit.weekly,
              color: 'emerald-500',
            },
          ],
          'accounts'
        )}
      </div>
    );
  };

  const renderBillingPage = () => {
    const summary = calculateSummary();

    return (
      <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sales → Billing
        </h1>

        {/* Header */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice No
              </label>
              <input
                type="text"
                value={invoiceData.invNo}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Date & Time
              </label>
              <input
                type="datetime-local"
                value={invoiceData.invDate}
                onChange={e =>
                  setInvoiceData(prev => ({ ...prev, invDate: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                value={invoiceData.branch}
                onChange={e =>
                  setInvoiceData(prev => ({ ...prev, branch: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option>Branch A</option>
                <option>Branch B</option>
                <option>Branch C</option>
                <option>Branch D</option>
                <option>Production Unit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Billing Type
              </label>
              <div className="flex items-center gap-2 mt-1">
                <label className="flex items-center gap-1 cursor-pointer p-2 border border-gray-300 bg-gray-50 rounded-full text-sm text-gray-500">
                  <input
                    type="radio"
                    name="billType"
                    value="retail"
                    checked={invoiceData.billType === 'retail'}
                    onChange={e =>
                      setInvoiceData(prev => ({
                        ...prev,
                        billType: e.target.value,
                      }))
                    }
                  />
                  Retail
                </label>
                <label className="flex items-center gap-1 cursor-pointer p-2 border border-gray-300 bg-gray-50 rounded-full text-sm text-gray-500">
                  <input
                    type="radio"
                    name="billType"
                    value="credit"
                    checked={invoiceData.billType === 'credit'}
                    onChange={e =>
                      setInvoiceData(prev => ({
                        ...prev,
                        billType: e.target.value,
                      }))
                    }
                  />
                  Credit
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Customer */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                value={invoiceData.custName}
                onChange={e =>
                  setInvoiceData(prev => ({
                    ...prev,
                    custName: e.target.value,
                  }))
                }
                placeholder="Search or enter customer"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={invoiceData.custPhone}
                onChange={e =>
                  setInvoiceData(prev => ({
                    ...prev,
                    custPhone: e.target.value,
                  }))
                }
                placeholder="10 digits"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={invoiceData.custAddr}
                onChange={e =>
                  setInvoiceData(prev => ({
                    ...prev,
                    custAddr: e.target.value,
                  }))
                }
                placeholder="Street, City"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GSTIN (optional)
              </label>
              <input
                type="text"
                value={invoiceData.custGST}
                onChange={e =>
                  setInvoiceData(prev => ({ ...prev, custGST: e.target.value }))
                }
                placeholder="27ABCDE1234F1Z5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
        </section>

        {/* Items */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap">
            <strong className="text-xl font-bold text-gray-800">Items</strong>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={addItemRow}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition-colors"
              >
                + Add Row
              </button>
            </div>
          </div>
          <div className="overflow-auto max-h-96 rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Product
                  </th>
                  <th className="text-left text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    SKU/HSN
                  </th>
                  <th className="text-left text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Unit
                  </th>
                  <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Qty
                  </th>
                  <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Rate
                  </th>
                  <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Disc %
                  </th>
                  <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Tax %
                  </th>
                  <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Line Total
                  </th>
                  <th className="text-center text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={item.product}
                        onChange={e =>
                          updateItem(item.id, 'product', e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={item.sku}
                        onChange={e =>
                          updateItem(item.id, 'sku', e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <select
                        value={item.unit}
                        onChange={e =>
                          updateItem(item.id, 'unit', e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option>Nos</option>
                        <option>Kg</option>
                        <option>Ltr</option>
                        <option>Mtr</option>
                      </select>
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e =>
                          updateItem(
                            item.id,
                            'qty',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full p-1 text-right border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={e =>
                          updateItem(
                            item.id,
                            'rate',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full p-1 text-right border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="number"
                        step="0.01"
                        value={item.disc}
                        onChange={e =>
                          updateItem(
                            item.id,
                            'disc',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full p-1 text-right border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200">
                      <input
                        type="number"
                        step="0.01"
                        value={item.tax}
                        onChange={e =>
                          updateItem(
                            item.id,
                            'tax',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full p-1 text-right border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </td>
                    <td className="p-2 border-b border-gray-200 text-right font-medium">
                      ₹{item.lineTotal.toFixed(2)}
                    </td>
                    <td className="p-2 border-b border-gray-200 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary + Payments */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <strong className="text-xl font-bold text-gray-800">
              Bill Summary
            </strong>
            <div className="my-4 border-b border-gray-200"></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Subtotal</span>
                <span>₹{summary.subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Overall Discount</span>
                <span className="flex items-center gap-2">
                  <select
                    value={invoiceData.overallDiscType}
                    onChange={e =>
                      setInvoiceData(prev => ({
                        ...prev,
                        overallDiscType: e.target.value,
                      }))
                    }
                    className="w-16 rounded-lg text-sm border border-gray-300"
                  >
                    <option value="amt">₹</option>
                    <option value="pct">%</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceData.overallDiscVal}
                    onChange={e =>
                      setInvoiceData(prev => ({
                        ...prev,
                        overallDiscVal: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-24 text-right rounded-lg text-sm border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Total Discount</span>
                <span>₹{summary.totalDiscount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Taxable Value</span>
                <span>₹{summary.taxableValue}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>CGST</span>
                <span>₹{summary.cgst}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>SGST</span>
                <span>₹{summary.sgst}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>IGST</span>
                <span>₹{summary.igst}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Round Off</span>
                <span>₹{summary.roundOff}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-yellow-600">
                <span>Net Amount</span>
                <span>₹{summary.netAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-xl font-bold text-gray-800">
                Payments
              </strong>
              <button
                onClick={addPaymentRow}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                + Add Payment
              </button>
            </div>
            <div className="my-4 border-b border-gray-200"></div>
            <div className="overflow-auto max-h-56 rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                      Mode
                    </th>
                    <th className="text-left text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                      Ref
                    </th>
                    <th className="text-right text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                      Amount
                    </th>
                    <th className="text-center text-xs text-gray-500 font-semibold p-2 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td className="p-2 border-b border-gray-200">
                        <select
                          value={payment.mode}
                          onChange={e =>
                            updatePayment(payment.id, 'mode', e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                        >
                          <option>Cash</option>
                          <option>Card</option>
                          <option>UPI</option>
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                        </select>
                      </td>
                      <td className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={payment.ref}
                          onChange={e =>
                            updatePayment(payment.id, 'ref', e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </td>
                      <td className="p-2 border-b border-gray-200">
                        <input
                          type="number"
                          step="0.01"
                          value={payment.amount}
                          onChange={e =>
                            updatePayment(
                              payment.id,
                              'amount',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-1 text-right border border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </td>
                      <td className="p-2 border-b border-gray-200 text-center">
                        <button
                          onClick={() => removePayment(payment.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Payments:</span>
                <span className="font-bold text-green-600">
                  ₹{payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">Balance:</span>
                <span
                  className={`font-bold ${parseFloat(summary.netAmount) - payments.reduce((sum, p) => sum + p.amount, 0) > 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  ₹
                  {(
                    parseFloat(summary.netAmount) -
                    payments.reduce((sum, p) => sum + p.amount, 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Save Invoice
              </button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Print
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderGenericPage = (page: string) => (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {menuItems[page as keyof typeof menuItems] || page}
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">This page is under development.</p>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Business Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">User ID: user-123</p>
        </div>

        <nav className="p-4">
          {Object.entries(menuItems).map(([key, label]) => (
            <div key={key}>
              <button
                onClick={() => setCurrentPage(key)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  currentPage === key
                    ? 'bg-yellow-100 text-blue-800 font-semibold'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                {label}
              </button>

              {submenus[key as keyof typeof submenus] &&
                currentPage === key && (
                  <div className="ml-4 mb-2">
                    {submenus[key as keyof typeof submenus].map(submenu => (
                      <button
                        key={submenu}
                        onClick={() =>
                          setCurrentPage(
                            submenu.toLowerCase().replace(/\s+/g, '-')
                          )
                        }
                        className="block w-full text-left p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                      >
                        {submenu}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && renderDashboard()}
        {(currentPage === 'sales' || currentPage === 'retail-sales-entry') &&
          renderBillingPage()}
        {currentPage !== 'dashboard' &&
          currentPage !== 'sales' &&
          currentPage !== 'retail-sales-entry' &&
          renderGenericPage(currentPage)}
      </main>
    </div>
  );
};

export default BusinessDashboard;
