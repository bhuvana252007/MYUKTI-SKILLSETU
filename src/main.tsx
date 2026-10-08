import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline availability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[SkillSetu PWA] New update available.');
  },
  onOfflineReady() {
    console.log('[SkillSetu PWA] App cached and ready to work completely offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
