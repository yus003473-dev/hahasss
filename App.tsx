
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Customer, Order, ActionLog, AppBackup } from './types.ts';
import { ProductManager } from './components/ProductManager.tsx';
import { OrderManager } from './components/OrderManager.tsx';
import { CustomerManager } from './components/CustomerManager.tsx';
import { 
  LayoutDashboard, ShoppingBag, Users, Monitor, HardDrive, 
  DownloadCloud, Save, Upload, RefreshCw, ShieldCheck
} from 'lucide-react';

const APP_VERSION = "2.5.1-Patched";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('psh_products');
    const savedCustomers = localStorage.getItem('psh_customers');
    const savedOrders = localStorage.getItem('psh_orders');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  useEffect(() => localStorage.setItem('psh_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('psh_customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('psh_orders', JSON.stringify(orders)), [orders]);

  const addLog = useCallback((message: string, type: ActionLog['type'] = 'INFO') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type
    }, ...prev].slice(0, 50));
  }, []);

  const exportBackup = () => {
    const data: AppBackup = {
      products,
      customers,
      orders,
      version: APP_VERSION,
      timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `接龙助手全量备份_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addLog("已下载系统备份文件到本地", "SUCCESS");
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm("确定恢复备份吗？这将覆盖当前数据。")) {
          setProducts(data.products || []);
          setCustomers(data.customers || []);
          setOrders(data.orders || []);
          addLog("本地数据恢复成功", "SUCCESS");
        }
      } catch (err) {
        addLog("备份文件解析失败", "ERROR");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
      
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 p-6 flex flex-col border-r border-slate-800 no-print">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">女王的接龙小助手</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">脱机运行就绪</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {[
            { id: 'orders', icon: LayoutDashboard, label: '订单流水' },
            { id: 'products', icon: ShoppingBag, label: '商品规格库' },
            { id: 'customers', icon: Users, label: '客户档案' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3 pt-6 border-t border-slate-800">
          {isInstallable && (
            <button 
              onClick={handleInstall} 
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg animate-bounce"
            >
              <DownloadCloud className="w-4 h-4" /> 安装到电脑桌面
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={exportBackup} className="flex flex-col items-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <Save className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] mt-1 text-slate-400 font-bold">备份数据</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] mt-1 text-slate-400 font-bold">还原数据</span>
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-2">
              <ShieldCheck className="w-3 h-3 text-green-500" /> 数据存储安全
            </div>
            <p className="text-[9px] text-slate-500 leading-tight italic">所有数据均保存在您的浏览器本地，不经过任何云端，隐私绝对安全。</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 no-print">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'orders' ? '订单处理中心' : activeTab === 'products' ? '商品与规格' : '客户地址簿'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">版本: {APP_VERSION} | 本地引擎就绪</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
             <HardDrive className="w-4 h-4 text-slate-400" />
             <span className="text-[10px] font-bold text-slate-600 uppercase">LocalStorage Active</span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'orders' && (
            <OrderManager 
              products={products} 
              customers={customers} 
              orders={orders} 
              setOrders={setOrders}
              logs={logs}
              addLog={addLog}
            />
          )}
          {activeTab === 'products' && <ProductManager products={products} setProducts={setProducts} />}
          {activeTab === 'customers' && <CustomerManager customers={customers} setCustomers={setCustomers} />}
        </div>
      </main>
    </div>
  );
};

export default App;
