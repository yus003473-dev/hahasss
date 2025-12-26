
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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

    // 尝试多次确保隐藏
    cleanup();
    setTimeout(cleanup, 100);
    requestAnimationFrame(cleanup);
    
  } catch (error) {
    console.error('React Root Error:', error);
    const errorFn = (window as any).showError;
    if (typeof errorFn === 'function') {
      errorFn('渲染失败', error instanceof Error ? error.message : String(error));
    }
  }
} else {
    console.error('Root element not found');
}
