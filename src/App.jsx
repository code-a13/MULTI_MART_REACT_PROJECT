import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import VendorDash from "./pages/VendorDash";
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/vendor" element={<VendorDash />} />
              <Route path="/" element={<Home />} />
              <Route path="/stores/:id" element={<StorePage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;