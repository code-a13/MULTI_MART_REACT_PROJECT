import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, Search, User, Menu, X, ArrowRight, Home, Shirt, ShoppingBag, Laptop, LayoutDashboard } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileOpen]);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setIsMobileOpen(false); 
    }
  };

  return (
    <>
      {/* DESKTOP & MAIN MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-[50] flex justify-center pt-4 px-4 md:px-8 pointer-events-none">
        <nav className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-2xl ${
          scrolled 
            ? "bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg py-3 px-4 md:px-6" 
            : "bg-white/95 backdrop-blur-md border border-gray-100 shadow-sm py-4 px-4 md:px-6"
        }`}>
          <div className="flex justify-between items-center">
            
            <Link to="/" className="flex items-center gap-2 group z-50 focus:outline-none rounded-lg pr-2">
              <div className="bg-gray-900 p-2 md:p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300 shadow-md">
                <Store size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight hidden sm:block">
                Multi-Mart.
              </span>
            </Link>
            
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6 relative group">
              <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer z-10" aria-label="Submit search">
                <Search size={18} />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products..." 
                className="w-full bg-gray-100/80 border border-transparent focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all text-gray-900 font-medium"
              />
            </form>

            <div className="flex gap-2 items-center z-50">
              <Link to="/vendor" className="hidden lg:flex px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full font-bold transition-all items-center gap-2">
                Vendor Area
              </Link>
              <div className="hidden md:block w-px h-5 bg-gray-200 mx-1"></div>
              <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all focus:outline-none" aria-label="User Profile">
                <User size={20} />
              </button>
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all group focus:outline-none" aria-label="Shopping Cart">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} key={cartCount} 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              
              <button 
                onClick={() => setIsMobileOpen(true)} 
                className="md:hidden p-2 text-gray-900 bg-gray-100 rounded-full ml-1 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors relative"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* THE FIX: NATIVE APP FULL-SCREEN TAKEOVER MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            // THE FIX: Slides up from the bottom of the screen like a real mobile app
            initial={{ opacity: 0, y: "100%" }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            // THE FIX: h-[100dvh] fixes the mobile browser cut-off issue permanently
            className="fixed inset-0 z-[9999] bg-gray-50 flex flex-col h-[100dvh] w-full overflow-hidden"
          >
            
            {/* 1. INTERNAL MENU HEADER (Ensures 'X' is ALWAYS visible) */}
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 p-2 rounded-xl text-white">
                  <Menu size={18} />
                </div>
                <span className="text-xl font-black text-gray-900 tracking-tight">Navigation</span>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)} 
                className="p-2 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. SCROLLABLE MIDDLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Welcome back</p>
                  <p className="text-lg font-black text-gray-900">Guest User</p>
                </div>
              </motion.div>

              <motion.form 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                onSubmit={handleSearch} className="relative w-full mb-8"
              >
                <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
                  <Search size={20} />
                </button>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Multi-Mart..." 
                  className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl py-4 pl-12 pr-4 text-base outline-none font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </motion.form>
              
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Browse Categories</p>

              <div className="flex flex-col gap-2">
                {[
                  { name: "Home", path: "/", icon: Home },
                  { name: "Men's Fashion", path: "/stores/men's clothing", icon: Shirt },
                  { name: "Women's Fashion", path: "/stores/women's clothing", icon: ShoppingBag },
                  { name: "Electronics", path: "/stores/electronics", icon: Laptop },
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                  >
                    <Link 
                      to={item.path} 
                      onClick={() => setIsMobileOpen(false)} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-50 hover:border-blue-100 transition-all group active:scale-[0.98] mb-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <item.icon size={22} />
                        </div>
                        <span className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{item.name}</span>
                      </div>
                      <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"/>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3. FIXED BOTTOM ACTION AREA (Never gets cut off) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              // THE FIX: pb-safe and extra padding ensures it floats above iPhone home bars and Android nav bars
              className="bg-white p-6 pb-8 border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            >
              <Link 
                to="/vendor" 
                onClick={() => setIsMobileOpen(false)} 
                className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20"
              >
                <LayoutDashboard size={20} />
                Vendor Dashboard
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}