import { Link } from "react-router-dom";
import { ShoppingCart, Store, Search, User, Menu } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion"; // Kept only for the cart badge pop effect

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    // OUTER WRAPPER: Centers the navbar and pushes it down slightly (pt-4)
    // pointer-events-none ensures the invisible areas don't block clicks on the page
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 md:px-8 pointer-events-none">
      
      {/* ACTUAL NAVBAR: Floating rectangle with rounded corners */}
      <nav 
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-2xl ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-blue-900/5 py-3 px-4 md:px-6" 
            : "bg-white/95 backdrop-blur-md border border-gray-100 shadow-sm py-4 px-4 md:px-6"
        }`}
      >
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 md:p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <Store size={20} className="md:w-6 md:h-6" />
            </div>
            {/* Hides text on very small screens to keep it responsive */}
            <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 tracking-tight hidden sm:block">
              Multi-Mart
            </span>
          </Link>
          
          {/* ENRICHED SEARCH BAR (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-gray-50/80 border border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all shadow-inner text-gray-800"
            />
          </div>

          {/* NAVIGATION LINKS */}
          <div className="flex gap-1 md:gap-2 items-center">
            <Link to="/" className="hidden md:flex px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full font-semibold transition-all">
              Home
            </Link>
            <Link to="/vendor" className="hidden lg:flex px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full font-semibold transition-all items-center gap-2">
              Vendor Area
            </Link>

            {/* DIVIDER */}
            <div className="hidden md:block w-px h-5 bg-gray-300 mx-1 md:mx-2"></div>

            {/* USER PROFILE ICON */}
            <button className="hidden sm:flex p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all">
              <User size={20} />
            </button>

            {/* CART ICON WITH ADVANCED BADGE */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group">
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount} 
                  className="absolute -top-1 -right-1 bg-gradient-to-tr from-red-600 to-pink-500 text-white text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* MOBILE MENU ICON */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full ml-1 transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}