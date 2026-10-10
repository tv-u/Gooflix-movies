import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Signal successful React mount for instant loader and GitHub Pages fallback
if (typeof window !== 'undefined') {
  (window as unknown as { __REACT_APP_MOUNTED__?: boolean }).__REACT_APP_MOUNTED__ = true;
}
