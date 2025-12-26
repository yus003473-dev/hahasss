
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 模块开始执行，标记为已加载
(window as any).__APP_LOADED__ = true;

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    const hide = () => {
      if (typeof (window as any).hideAppLoader === 'function') {
        (window as any).hideAppLoader();
      }
    };
    
    // 渲染启动后立即隐藏
    hide();
    // 冗余保险：在下一个动画帧再次确保隐藏
    requestAnimationFrame(hide);
    
  } catch (error) {
    console.error('React Root Error:', error);
    if (typeof (window as any).showError === 'function') {
      (window as any).showError('渲染失败', error instanceof Error ? error.message : String(error));
    }
  }
} else {
    console.error('Root element not found');
}
