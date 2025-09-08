import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  sales: { today: string; monthly: string; retail: string; credit: string };
  stock: { branches: string; lowStock: string; rawMaterial: string };
  purchases: { today: string; pendingPayments: string; expenses: string };
  production: { issued: string; produced: string; wastage: string };
  hr: { staff: string; leaves: string; salaries: string };
  profit: { monthly: string; weekly: string };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DashboardData>({
    sales: {
      today: '₹ 0.00',
      monthly: '₹ 0.00',
      retail: '0.00%',
      credit: '0.00%',
    },
    stock: { branches: '0', lowStock: '0', rawMaterial: '0' },
    purchases: {
      today: '₹ 0.00',
      pendingPayments: '₹ 0.00',
      expenses: '₹ 0.00',
    },
    production: { issued: '0', produced: '0', wastage: '0' },
    hr: { staff: '0', leaves: '0', salaries: '₹ 0.00' },
    profit: { monthly: '₹ 0.00', weekly: '₹ 0.00' },
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
    'master-setup': ['Branch Master', 'Staff Master', 'Product Master'],
    sales: ['Retail Sales Entry', 'Credit Sales Entry', 'Sales Report'],
    purchase: ['Purchase Entry', 'Purchase Return Entry'],
    'stock-inventory': ['Stock Transfer', 'Stock Adjustment'],
    'production-unit': ['Production Entry', 'Wastage Entry'],
    expenses: ['Expense Entry', 'Expense Report'],
    accounts: ['Cash/Bank Book', 'Profit & Loss Report'],
    'hr-staff': ['Attendance Entry', 'Salary Entry'],
  };

  const setActivePage = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        sales: {
          today: '₹ 15,250.00',
          monthly: '₹ 4,85,750.00',
          retail: '65.50%',
          credit: '34.50%',
        },
        stock: { branches: '3', lowStock: '5', rawMaterial: '85%' },
        purchases: {
          today: '₹ 8,500.00',
          pendingPayments: '₹ 25,000.00',
          expenses: '₹ 12,000.00',
        },
        production: { issued: '150', produced: '148', wastage: '2' },
        hr: { staff: '12', leaves: '2', salaries: '₹ 85,000.00' },
        profit: { monthly: '₹ 1,25,000.00', weekly: '₹ 28,750.00' },
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const createDashboardSection = (
    title: string,
    dataArray: Array<{ label: string; value: string; color: string }>,
    page: string
  ) => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={() => setActivePage(page)}
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            View Details
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200"
            >
              <p className="text-lg font-bold text-yellow-600">{item.value}</p>
              <p className="text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      );
    }

    return (
      <div className="p-8 space-y-8">
        {/* Sales Overview */}
        {createDashboardSection(
          'Sales Overview',
          [
            {
              label: "Today's Sales",
              value: data.sales.today,
              color: 'yellow-500',
            },
            {
              label: 'Monthly Sales',
              value: data.sales.monthly,
              color: 'yellow-500',
            },
            {
              label: 'Retail vs Credit',
              value: `${data.sales.retail} / ${data.sales.credit}`,
              color: 'yellow-500',
            },
          ],
          'sales'
        )}

        {/* Stock / Inventory */}
        {createDashboardSection(
          'Stock / Inventory',
          [
            {
              label: 'Current Stock (Units)',
              value: data.stock.branches,
              color: 'green-500',
            },
            {
              label: 'Low Stock Alerts',
              value: data.stock.lowStock,
              color: 'red-500',
            },
            {
              label: 'Raw Material Stock',
              value: data.stock.rawMaterial,
              color: 'green-500',
            },
          ],
          'stock-inventory'
        )}

        {/* Purchases & Expenses */}
        {createDashboardSection(
          'Purchases & Expenses',
          [
            {
              label: "Today's Purchases",
              value: data.purchases.today,
              color: 'yellow-500',
            },
            {
              label: 'Pending Payments',
              value: data.purchases.pendingPayments,
              color: 'red-500',
            },
            {
              label: 'Monthly Expenses',
              value: data.purchases.expenses,
              color: 'yellow-500',
            },
          ],
          'purchase'
        )}

        {/* Production */}
        {createDashboardSection(
          'Production',
          [
            {
              label: 'Raw Material Issued',
              value: data.production.issued,
              color: 'indigo-500',
            },
            {
              label: 'Finished Goods Produced',
              value: data.production.produced,
              color: 'indigo-500',
            },
            {
              label: 'Wastage / Returns',
              value: data.production.wastage,
              color: 'red-500',
            },
          ],
          'production-unit'
        )}

        {/* Staff / HR */}
        {createDashboardSection(
          'Staff / HR',
          [
            { label: 'Total Staff', value: data.hr.staff, color: 'purple-500' },
            {
              label: 'Leaves Today',
              value: data.hr.leaves,
              color: 'purple-500',
            },
            {
              label: 'Monthly Salaries',
              value: data.hr.salaries,
              color: 'red-500',
            },
          ],
          'hr-staff'
        )}

        {/* Profit & Loss Snapshot */}
        {createDashboardSection(
          'Profit & Loss Snapshot',
          [
            {
              label: 'Monthly Net Profit',
              value: data.profit.monthly,
              color: 'emerald-500',
            },
            {
              label: 'Weekly Net Profit',
              value: data.profit.weekly,
              color: 'emerald-500',
            },
          ],
          'accounts'
        )}
      </div>
    );
  };

  const renderBillingPage = () => {
    return (
      <div style={{ backgroundColor: '#fff9e6', minHeight: '100vh' }}>
        <style>
          {`
            /* Yellow & White theme, light background */
            .billing-page {
              --bg: #fff9e6;
              --panel: #ffffff;
              --accent: #f6c84c;
              --accent-2: #f59e0b;
              --muted: #6b6b6b;
              --ink: #1f2937;
              --radius: 12px;
            }
            .billing-page * { box-sizing: border-box; }
            .billing-page .wrap { max-width: 1200px; margin: 20px auto; padding: 16px; }
            .billing-page header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .billing-page h1 { margin: 0; font-size: 20px; }
            .billing-page .sub { color: var(--muted); font-size: 13px; }
            .billing-page .grid { display: grid; gap: 14px; }
            .billing-page .two { grid-template-columns: 1fr 420px; }
            @media(max-width:980px) { .billing-page .two { grid-template-columns: 1fr; } }
            .billing-page .card { background: var(--panel); border-radius: var(--radius); padding: 14px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 6px 18px rgba(20,20,20,0.03); }
            .billing-page label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
            .billing-page input, .billing-page select, .billing-page textarea, .billing-page button { font-size: 14px; }
            .billing-page input[type=text], .billing-page input[type=number], .billing-page input[type=datetime-local], .billing-page select, .billing-page textarea {
              width: 100%; padding: 9px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: white;
            }
            .billing-page textarea { resize: vertical; }
            .billing-page .row { display: grid; grid-template-columns: repeat(12,1fr); gap: 10px; }
            .billing-page .col-3 { grid-column: span 3; }
            .billing-page .col-4 { grid-column: span 4; }
            .billing-page .col-6 { grid-column: span 6; }
            .billing-page .col-12 { grid-column: span 12; }
            .billing-page .items-wrap { overflow: auto; border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; }
            .billing-page table { width: 100%; border-collapse: collapse; }
            .billing-page thead th { padding: 8px 10px; text-align: left; background: linear-gradient(90deg, rgba(246,200,76,0.15), rgba(246,158,11,0.05)); color: var(--ink); font-weight: 600; border-bottom: 1px solid rgba(0,0,0,0.06); }
            .billing-page tbody td { padding: 8px 10px; border-bottom: 1px dashed rgba(0,0,0,0.04); }
            .billing-page .num { text-align: right; }
            .billing-page .toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
            .billing-page .btn { border: 0; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
            .billing-page .btn-primary { background: linear-gradient(180deg,var(--accent),var(--accent-2)); color: #111; }
            .billing-page .btn-ghost { background: transparent; border: 1px solid rgba(0,0,0,0.06); }
            .billing-page .btn-neutral { background: #f3f3f3; }
            .billing-page .summary { display: grid; gap: 8px; }
            .billing-page .line { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #fff; border-radius: 8px; border: 1px solid rgba(0,0,0,0.04); }
            .billing-page .total { font-size: 18px; font-weight: 800; }
            .billing-page .muted { color: var(--muted); font-size: 13px; }
            .billing-page .small { font-size: 12px; color: var(--muted); }
            .billing-page .result-list { max-height: 220px; overflow: auto; margin-top: 8px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); padding: 8px; background: #fff; }
            .billing-page .success { color: green; }
            .billing-page .failed { color: #b91c1c; }
            .billing-page footer { margin-top: 18px; text-align: right; }
            .delivery-only { display: none; }
            @media print { .no-print { display: none; } }
          `}
        </style>

        <div className="billing-page">
          <div className="wrap">
            <header>
              <div>
                <h1>Sales → Billing</h1>
                <div className="sub">
                  Create single invoice or bulk-upload multiple invoices via CSV
                </div>
              </div>
              <div className="toolbar no-print">
                <button id="downloadTemplate" className="btn btn-ghost">
                  Download CSV Template
                </button>
                <input
                  id="csvFile"
                  type="file"
                  accept="text/csv"
                  style={{ display: 'none' }}
                />
                <button id="chooseCsv" className="btn btn-primary">
                  Upload CSV (Bulk)
                </button>
              </div>
            </header>

            <main className="grid two">
              {/* Left: Single Billing Form */}
              <section className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Single Invoice / POS</strong>
                  <div className="small muted">
                    Fields auto-update dashboard-ready totals
                  </div>
                </div>

                {/* Header */}
                <div className="row">
                  <div className="col-3">
                    <label>Invoice No</label>
                    <input id="invNo" type="text" readOnly />
                  </div>
                  <div className="col-3">
                    <label>Invoice Date & Time</label>
                    <input id="invDate" type="datetime-local" />
                  </div>
                  <div className="col-3">
                    <label>Branch</label>
                    <select id="branch">
                      <option>Branch A</option>
                      <option>Branch B</option>
                      <option>Branch C</option>
                      <option>Branch D</option>
                      <option>Production Unit</option>
                    </select>
                  </div>
                  <div className="col-3">
                    <label>Billing Type</label>
                    <select id="billType">
                      <option value="retail">Retail</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                </div>

                {/* Customer */}
                <div className="row" style={{ marginTop: '12px' }}>
                  <div className="col-4">
                    <label>Customer Name</label>
                    <input
                      id="custName"
                      type="text"
                      placeholder="Walk-in / customer name"
                    />
                  </div>
                  <div className="col-4">
                    <label>Contact Number</label>
                    <input id="custPhone" type="text" placeholder="Phone" />
                  </div>
                  <div className="col-4">
                    <label>GSTIN (optional)</label>
                    <input id="custGST" type="text" placeholder="GSTIN" />
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginTop: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Items</strong>
                    <div className="toolbar no-print">
                      <button id="addRow" className="btn btn-neutral">
                        + Add Row
                      </button>
                      <button id="pasteTSV" className="btn btn-ghost">
                        Paste TSV
                      </button>
                    </div>
                  </div>

                  <div className="items-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>HSN/SKU</th>
                          <th>Unit</th>
                          <th className="num">Qty</th>
                          <th className="num">Rate</th>
                          <th className="num">Disc %</th>
                          <th className="num">Tax %</th>
                          <th className="num">Line Total</th>
                          <th className="no-print">Action</th>
                        </tr>
                      </thead>
                      <tbody id="itemsBody"></tbody>
                    </table>
                  </div>
                </div>

                {/* Additional */}
                <div className="row" style={{ marginTop: '12px' }}>
                  <div className="col-4">
                    <label>Salesperson</label>
                    <select id="salesperson">
                      <option>— Select —</option>
                      <option>Raj</option>
                      <option>Anita</option>
                      <option>Faisal</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label>Delivery Required?</label>
                    <select id="deliveryReq">
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="col-4 delivery-only">
                    <label>Delivery Date</label>
                    <input id="deliveryDate" type="date" />
                  </div>
                  <div className="col-4 delivery-only">
                    <label>Vehicle / AWB</label>
                    <input
                      id="vehicle"
                      type="text"
                      placeholder="Vehicle / AWB"
                    />
                  </div>
                  <div className="col-12">
                    <label>Remarks</label>
                    <textarea id="remarks" rows={2}></textarea>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    marginTop: '12px',
                  }}
                >
                  <button id="saveSingle" className="btn btn-primary">
                    Save Invoice
                  </button>
                  <button id="printSingle" className="btn btn-ghost">
                    Save & Print
                  </button>
                  <button id="holdSingle" className="btn btn-ghost">
                    Hold
                  </button>
                </div>
              </section>

              {/* Right: Summary + Payments + Bulk Results */}
              <aside>
                <div className="card summary">
                  <strong>Bill Summary</strong>
                  <div className="line">
                    <span>Subtotal</span>
                    <span id="sumSubtotal">0.00</span>
                  </div>
                  <div className="line">
                    <span>Overall Discount</span>
                    <span>
                      <select id="overallDiscType" style={{ width: '70px' }}>
                        <option value="amt">₹</option>
                        <option value="pct">%</option>
                      </select>{' '}
                      <input
                        id="overallDiscVal"
                        type="number"
                        step="0.01"
                        defaultValue="0"
                        style={{ width: '110px' }}
                      />
                    </span>
                  </div>
                  <div className="line">
                    <span>Total Discount</span>
                    <span id="sumDiscount">0.00</span>
                  </div>
                  <div className="line">
                    <span>Taxable Value</span>
                    <span id="sumTaxable">0.00</span>
                  </div>
                  <div className="line">
                    <span>CGST</span>
                    <span id="sumCGST">0.00</span>
                  </div>
                  <div className="line">
                    <span>SGST</span>
                    <span id="sumSGST">0.00</span>
                  </div>
                  <div className="line">
                    <span>IGST</span>
                    <span id="sumIGST">0.00</span>
                  </div>
                  <div className="line">
                    <span>Delivery Charges</span>
                    <input
                      id="deliveryCharges"
                      type="number"
                      step="0.01"
                      defaultValue="0"
                      style={{ width: '110px', textAlign: 'right' }}
                    />
                  </div>
                  <div className="line">
                    <span>Round Off</span>
                    <span id="sumRound">0.00</span>
                  </div>
                  <div className="line total">
                    <span>Net Amount</span>
                    <span id="sumNet">0.00</span>
                  </div>
                </div>

                <div style={{ height: '12px' }}></div>

                <div className="card">
                  <strong>Payments</strong>
                  <div style={{ marginTop: '8px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Mode</th>
                          <th>Ref</th>
                          <th className="num">Amount</th>
                        </tr>
                      </thead>
                      <tbody id="payBody"></tbody>
                    </table>
                    <div
                      style={{ marginTop: '8px', display: 'flex', gap: '8px' }}
                    >
                      <button id="addPay" className="btn btn-ghost">
                        + Add Payment
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px' }} className="line">
                    <span>Amount Received</span>
                    <span id="sumReceived">0.00</span>
                  </div>
                  <div style={{ marginTop: '8px' }} className="line">
                    <span>Balance / Credit</span>
                    <span id="sumBalance">0.00</span>
                  </div>
                </div>

                <div style={{ height: '12px' }}></div>

                <div className="card">
                  <strong>Bulk Upload Results</strong>
                  <div className="small muted">
                    After upload, invoices created here will be listed
                  </div>
                  <div className="result-list" id="bulkResults"></div>
                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
                  >
                    <button id="exportJson" className="btn btn-neutral">
                      Export Results JSON
                    </button>
                    <button id="clearResults" className="btn btn-ghost">
                      Clear
                    </button>
                  </div>
                </div>
              </aside>
            </main>

            <footer className="no-print">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div className="small muted">
                  CSV rules: You can supply multiple rows with the same
                  InvoiceNo (will be grouped). Required headers:
                  InvoiceNo,Date,CustomerName,CustomerPhone,Product,Qty,Rate,
                  Discount,Tax,DeliveryCharges,PaymentMode
                </div>
                <div>
                  <button id="downloadSample" className="btn btn-ghost">
                    Download Sample CSV
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Utilities
            const $ = id => document.getElementById(id);
            const fmt = n => (isFinite(n) ? Number(n).toFixed(2) : '0.00');
            const toNum = v => parseFloat(v||0) || 0;

            // Init
            function genInvoiceNo(){ const t=new Date(); return \`INV-\${t.getFullYear()}\${String(t.getMonth()+1).padStart(2,'0')}\${String(t.getDate()).padStart(2,'0')}-\${String(t.getHours()).padStart(2,'0')}\${String(t.getMinutes()).padStart(2,'0')}\${String(t.getSeconds()).padStart(2,'0')}\` }
            function setNow(){ const t=new Date(); const tzOff=t.getTimezoneOffset(); $('invDate').value=new Date(t.getTime()-(tzOff*60000)).toISOString().slice(0,16) }
            if($('invNo')) $('invNo').value = genInvoiceNo(); 
            if($('invDate')) setNow();

            // Items row
            function addItemRow(prefill={}){
              const tr=document.createElement('tr');
              tr.innerHTML = \`
                <td><input type="text" value="\${prefill.product||''}" placeholder="Product name"/></td>
                <td><input type="text" value="\${prefill.hsn||''}"/></td>
                <td><input type="text" value="\${prefill.unit||'pcs'}"/></td>
                <td class="num"><input type="number" min="0" step="1" value="\${prefill.qty||1}"/></td>
                <td class="num"><input type="number" min="0" step="0.01" value="\${prefill.rate||0}"/></td>
                <td class="num"><input type="number" min="0" step="0.01" value="\${prefill.disc||0}"/></td>
                <td class="num"><input type="number" min="0" step="0.01" value="\${prefill.tax||0}"/></td>
                <td class="num line-total">0.00</td>
                <td class="no-print"><button class="btn btn-ghost">Remove</button></td>
              \`;
              if($('itemsBody')) $('itemsBody').appendChild(tr);
              tr.querySelectorAll('input').forEach(i=>i.addEventListener('input', recalcAll));
              tr.querySelector('button').addEventListener('click', ()=>{ tr.remove(); recalcAll() });
              recalcAll();
            }
            
            // Initialize with default item
            setTimeout(() => {
              if($('itemsBody')) addItemRow({product:'Item A',qty:1,rate:100,disc:0,tax:18});
            }, 100);

            // Payments
            function addPayRow(prefill={}){
              const tr=document.createElement('tr');
              tr.innerHTML = \`
                <td><select><option>Cash</option><option>Card</option><option>UPI</option><option>Credit</option></select></td>
                <td><input type="text" value="\${prefill.ref||''}"/></td>
                <td class="num"><input type="number" min="0" step="0.01" value="\${prefill.amount||0}"/></td>
              \`;
              if($('payBody')) $('payBody').appendChild(tr);
              tr.querySelectorAll('input,select').forEach(i=>i.addEventListener('input', recalcAll));
              recalcAll();
            }
            
            // Initialize payment row
            setTimeout(() => {
              if($('payBody')) addPayRow({amount:0});
            }, 100);

            // Recalc
            function recalcAll(){
              const scope = 'intra'; // For simplicity, keep CGST+SGST
              let subtotal=0, totalLineDisc=0, cgst=0, sgst=0, igst=0;
              if($('itemsBody')) {
                [...$('itemsBody').querySelectorAll('tr')].forEach(tr=>{
                  const inputs = tr.querySelectorAll('input');
                  const qty = toNum(inputs[3].value), rate = toNum(inputs[4].value), disc = toNum(inputs[5].value), tax = toNum(inputs[6].value);
                  const base = qty*rate; const lineDisc = base*(disc/100); const taxable = Math.max(0, base-lineDisc);
                  const lineTax = taxable*(tax/100);
                  if(scope==='intra'){ cgst += lineTax/2; sgst += lineTax/2 } else { igst += lineTax }
                  const lineTotal = taxable + lineTax;
                  subtotal += taxable; totalLineDisc += lineDisc;
                  tr.querySelector('.line-total').textContent = fmt(lineTotal);
                });
              }

              const discType = $('overallDiscType') ? $('overallDiscType').value : 'amt';
              const discVal = $('overallDiscVal') ? toNum($('overallDiscVal').value) : 0;
              const overallDiscount = discType==='pct' ? (subtotal*discVal/100) : discVal;
              const taxableAfter = Math.max(0, subtotal - overallDiscount);

              const totalTax = cgst+sgst+igst;
              const gross = taxableAfter + totalTax + ($('deliveryCharges') ? toNum($('deliveryCharges').value) : 0);
              const rounded = Math.round(gross);
              const roundOff = rounded - gross;

              let received = 0;
              if($('payBody')) {
                [...$('payBody').querySelectorAll('tr')].forEach(tr=>{ 
                  const inputs = tr.querySelectorAll('input'); 
                  const v = toNum(inputs[1]?.value || inputs[0]?.value); 
                  received += v; 
                });
              }
              const balance = Math.max(0, rounded - received);

              if($('sumSubtotal')) $('sumSubtotal').textContent = fmt(subtotal);
              if($('sumDiscount')) $('sumDiscount').textContent = fmt(totalLineDisc + overallDiscount);
              if($('sumTaxable')) $('sumTaxable').textContent = fmt(taxableAfter);
              if($('sumCGST')) $('sumCGST').textContent = fmt(cgst);
              if($('sumSGST')) $('sumSGST').textContent = fmt(sgst);
              if($('sumIGST')) $('sumIGST').textContent = fmt(igst);
              if($('sumRound')) $('sumRound').textContent = fmt(roundOff);
              if($('sumNet')) $('sumNet').textContent = fmt(rounded);
              if($('sumReceived')) $('sumReceived').textContent = fmt(received);
              if($('sumBalance')) $('sumBalance').textContent = fmt(balance);
            }

            // Event Listeners
            document.addEventListener('DOMContentLoaded', function() {
              // Add event listeners after DOM is ready
              if($('addRow')) $('addRow').addEventListener('click', ()=>addItemRow());
              if($('addPay')) $('addPay').addEventListener('click', ()=>addPayRow());
              
              if($('saveSingle')) $('saveSingle').addEventListener('click', ()=>{
                alert('Invoice saved successfully!');
              });
              
              if($('printSingle')) $('printSingle').addEventListener('click', ()=>{
                window.print();
              });
              
              if($('holdSingle')) $('holdSingle').addEventListener('click', ()=>{
                alert('Invoice held in draft!');
              });
              
              if($('deliveryReq')) $('deliveryReq').addEventListener('change', ()=>{ 
                const show=$('deliveryReq').value==='yes'; 
                document.querySelectorAll('.delivery-only').forEach(el=>el.style.display = show ? 'block' : 'none') 
              });
              
              if($('overallDiscType')) $('overallDiscType').addEventListener('change', recalcAll);
              if($('overallDiscVal')) $('overallDiscVal').addEventListener('input', recalcAll);
              if($('deliveryCharges')) $('deliveryCharges').addEventListener('input', recalcAll);
              
              // CSV functionality
              if($('downloadTemplate')) $('downloadTemplate').addEventListener('click', ()=>{
                const headers = ['InvoiceNo','Date','CustomerName','CustomerPhone','Product','Qty','Rate','Discount','Tax','DeliveryCharges','PaymentMode'];
                const sample = ['INV-20250908-001','2025-09-08 10:00','Acme Traders','9876543210','Item A','2','100','0','18','50','Cash'];
                const content = headers.join(',') + '\\n' + sample.join(',');
                const blob = new Blob([content], {type:'text/csv;charset=utf-8;'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); 
                a.href=url; 
                a.download='invoice_template.csv'; 
                document.body.appendChild(a); 
                a.click(); 
                a.remove(); 
                URL.revokeObjectURL(url);
              });
              
              if($('chooseCsv')) $('chooseCsv').addEventListener('click', ()=> {
                if($('csvFile')) $('csvFile').click()
              });
              
              if($('downloadSample')) $('downloadSample').addEventListener('click', ()=> {
                if($('downloadTemplate')) $('downloadTemplate').click()
              });
              
              // Initial calculation
              setTimeout(recalcAll, 200);
            });
          `,
          }}
        />
      </div>
    );
  };

  const renderGenericPage = (pageName: string) => {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {menuItems[pageName as keyof typeof menuItems] || pageName}
          </h1>
          <p className="text-gray-600 mb-6">
            This page is under development. Content for {pageName} will be added
            soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Available Features:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {submenus[pageName as keyof typeof submenus]?.map(
                (item, index) => <li key={index}>{item}</li>
              ) || <li>Coming soon...</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'sales':
      case 'retail-sales-entry':
        return renderBillingPage();
      default:
        return renderGenericPage(currentPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Business Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Management System</p>
        </div>

        <nav className="flex-1 p-4">
          {Object.entries(menuItems).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === key
                  ? 'bg-yellow-100 text-yellow-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg text-red-600 bg-red-50 border border-red-600 hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems[currentPage as keyof typeof menuItems] || currentPage}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{' '}
                {JSON.parse(localStorage.getItem('user') || '{}').email ||
                  'User'}
                {JSON.parse(localStorage.getItem('user') || '{}').role ===
                  'admin' && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    ADMIN
                  </span>
                )}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  JSON.parse(localStorage.getItem('user') || '{}').role ===
                  'admin'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                <span className="text-white text-sm font-semibold">
                  {(JSON.parse(localStorage.getItem('user') || '{}').email ||
                    'U')[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
