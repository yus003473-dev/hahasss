
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 尽快通知系统：脚本已成功加载并开始执行
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { API_KEY: "" } };
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
    
    // 渲染启动后立即隐藏加载动画
    const hideLoader = () => {
      if (typeof (window as any).hideAppLoader === 'function') {
        (window as any).hideAppLoader();
      }
    };
    
    hideLoader();
    // 冗余保险：下一帧再次尝试，确保渲染队列已排满
    requestAnimationFrame(hideLoader);
    
  } catch (error) {
    console.error('Render Error:', error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerText = 'React 渲染异常: ' + (error instanceof Error ? error.message : String(error));
    }
  }
}
