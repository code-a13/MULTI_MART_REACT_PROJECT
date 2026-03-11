import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Components & Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import VendorDash from "./pages/VendorDash";

// Uncomment these if you added them from our previous sessions!
// import { AuthProvider } from "./context/AuthContext"; 
// import { ToastContainer } from "react-toastify"; 
// import Checkout from "./pages/Checkout";

function App() {
  return (
    // <AuthProvider> 
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            
            {/* THE FIX IS HERE: Changed py-8 to pt-28 pb-8 */}
            {/* pt-28 acts as a bumper to stop the Home page from hiding under the Navbar */}
            <div className="container mx-auto px-4 pt-28 pb-8">
              <Routes>
                <Route path="/vendor" element={<VendorDash />} />
                <Route path="/" element={<Home />} />
                <Route path="/stores/:id" element={<StorePage />} />
                <Route path="/cart" element={<CartPage />} />
                {/* <Route path="/checkout" element={<Checkout />} /> */}
              </Routes>
            </div>
            
            {/* <ToastContainer position="bottom-right" autoClose={2000} theme="dark" /> */}
          </div>
        </Router>
      </CartProvider>
    // </AuthProvider>
  );
}

export default App;