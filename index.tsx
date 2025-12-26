
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 注册 Service Worker (PWA 支持)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/hahasss/sw.js').catch(err => {
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
    
    // 渲染启动后隐藏加载条
    const cleanup = () => {
      const hideFn = (window as any).hideAppLoader;
      if (typeof hideFn === 'function') {
        hideFn();
      }
    };

    // 多重保证隐藏
    cleanup();
    setTimeout(cleanup, 200);
    requestAnimationFrame(cleanup);
    
  } catch (error) {
    console.error('React Root Error:', error);
    const errorFn = (window as any).showError;
    if (typeof errorFn === 'function') {
      errorFn(error instanceof Error ? error.message : '渲染过程中发生未知错误');
    }
  }
}
