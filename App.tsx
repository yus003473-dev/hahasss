
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Customer, Order, ActionLog, AppBackup } from './types.ts';
import { ProductManager } from './components/ProductManager.tsx';
import { OrderManager } from './components/OrderManager.tsx';
import { CustomerManager } from './components/CustomerManager.tsx';
import { 
  LayoutDashboard, ShoppingBag, Users, Monitor, HardDrive, 
  DownloadCloud, Save, Upload, ShieldCheck
} from 'lucide-react';

const APP_VERSION = "2.6.0-Safe";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeParseArray = (key: string): any[] => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return [];
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    setProducts(safeParseArray('psh_products'));
    setCustomers(safeParseArray('psh_customers'));
    setOrders(safeParseArray('psh_orders'));
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) localStorage.setItem('psh_products', JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    if (Array.isArray(customers)) localStorage.setItem('psh_customers', JSON.stringify(customers));
  }, [customers]);
  
  useEffect(() => {
    if (Array.isArray(orders)) localStorage.setItem('psh_orders', JSON.stringify(orders));
  }, [orders]);

  const addLog = useCallback((message: string, type: ActionLog['type'] = 'INFO') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message: message || "...",
      type
    }, ...(Array.isArray(prev) ? prev : [])].slice(0, 50));
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 border-r border-slate-800">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-500 rounded-lg"><Monitor className="w-6 h-6" /></div>
          <h1 className="font-bold">女王接龙助手</h1>
        </div>

        <nav className="space-y-1">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'orders' ? 'bg-indigo-600' : 'text-slate-400'}`}>
            <LayoutDashboard className="w-5 h-5" /> 订单中心
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'products' ? 'bg-indigo-600' : 'text-slate-400'}`}>
            <ShoppingBag className="w-5 h-5" /> 商品规格
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'customers' ? 'bg-indigo-600' : 'text-slate-400'}`}>
            <Users className="w-5 h-5" /> 客户档案
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === 'orders' ? '订单中心' : activeTab === 'products' ? '商品规格' : '客户档案'}
          </h2>
          <p className="text-xs text-slate-400">v{APP_VERSION}</p>
        </header>

        {activeTab === 'orders' && <OrderManager products={products} customers={customers} orders={orders} setOrders={setOrders} logs={logs} addLog={addLog} />}
        {activeTab === 'products' && <ProductManager products={products} setProducts={setProducts} />}
        {activeTab === 'customers' && <CustomerManager customers={customers} setCustomers={setCustomers} />}
      </main>
    </div>
  );
};

export default App;
