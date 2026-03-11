import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    // THE MAIN SWITCH: Wrapping the whole app in AuthProvider
    <AuthProvider> 
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* GLOBAL NAVBAR */}
            <Navbar />
            
            {/* MAIN CONTENT WRAPPER WITH PADDING FOR FIXED NAVBAR */}
            <div className="container mx-auto px-4 pt-28 pb-8">
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

export default App;