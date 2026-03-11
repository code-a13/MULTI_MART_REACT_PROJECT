import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// 1. ALL GLOBAL PROVIDERS ACTIVATED
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; 

// 2. TOAST NOTIFICATIONS ACTIVATED
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

// 3. COMPONENTS & PAGES
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import VendorDash from "./pages/VendorDash";

// 4. GLOBAL SCROLL RESTORATION COMPONENT
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Instantly snap the browser scroll to X:0, Y:0
    window.scrollTo(0, 0);
  }, [pathname]); // This runs every time the URL path changes
  
  return null; // This component is invisible
}

export default function App() {
  return (
    // THE MAIN SWITCH: Wrapping the whole app in AuthProvider
    <AuthProvider> 
      <CartProvider>
        <Router>
          
          {/* Invisible watcher that resets scroll on every route change */}
          <ScrollToTop /> 
          
          <div className="min-h-screen bg-white font-sans flex flex-col">
            
            {/* GLOBAL NAVBAR */}
            <Navbar />
            
            {/* MAIN CONTENT WRAPPER 
                Removed the hardcoded "container mx-auto px-4 pt-28" 
                so pages like Home can manage their own full-width premium layouts 
            */}
            <div className="flex-1 w-full relative">
              <Routes>
                <Route path="/vendor" element={<VendorDash />} />
                <Route path="/" element={<Home />} />
                <Route path="/stores/:id" element={<StorePage />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </div>
            
            {/* GLOBAL TOAST CONTAINER: Listens for notifications from any page */}
            <ToastContainer 
              position="bottom-right" 
              autoClose={2000} 
              theme="dark" 
              hideProgressBar={false}
            />
            
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}