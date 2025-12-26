
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 渲染启动前即刻清理加载器（防御性调用）
const hideLoader = () => {
  if (typeof (window as any).hideAppLoader === 'function') {
    (window as any).hideAppLoader();
  }
};

// 注册 Service Worker (仅在生产环境)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // 使用相对路径以适配子目录部署
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // 渲染完成后再次确保隐藏
    setTimeout(hideLoader, 0);
    
  } catch (error) {
    console.error('React Root Error:', error);
    if (typeof (window as any).showError === 'function') {
      (window as any).showError(error instanceof Error ? error.message : '组件初始化失败');
    }
  }
}
