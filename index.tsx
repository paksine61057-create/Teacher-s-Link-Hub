import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Application starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Application mounted successfully');
} catch (error) {
  console.error('Error mounting application:', error);
  rootElement.innerHTML = `<div style="padding: 20px; color: red;"><h1>Application Error</h1><pre>${error}</pre></div>`;
}