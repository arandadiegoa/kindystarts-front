import { StrictMode } from "react";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import './index.css'
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
      <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
