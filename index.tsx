
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 注册 Service Worker，使用相对路径
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
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
    
    // 立即尝试隐藏加载器
    if ((window as any).hideAppLoader) {
      (window as any).hideAppLoader();
    }
  } catch (error) {
    console.error('渲染失败:', error);
    if ((window as any).showError) {
      (window as any).showError('启动失败，请检查浏览器版本或清理缓存');
    }
  }
}
