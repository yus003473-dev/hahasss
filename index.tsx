
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // 渲染启动后隐藏加载动画
    requestAnimationFrame(() => {
      if (typeof (window as any).hideAppLoader === 'function') {
        (window as any).hideAppLoader();
      }
    });
  } catch (error) {
    console.error('Render Error:', error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerText = 'React 渲染异常: ' + (error instanceof Error ? error.message : String(error));
    }
  }
}
