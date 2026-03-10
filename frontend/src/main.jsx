
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<LanguageProvider>
<App />
<Toaster position="top-right" />
</LanguageProvider>
</BrowserRouter>
);
