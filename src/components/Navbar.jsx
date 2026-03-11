import { Link, useNavigate } from "react-router-dom";
// FIX: Added ArrowRight to the imports below!
import { ShoppingCart, Store, Search, User, Menu, X, ArrowRight } from "lucide-react";
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
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 md:px-8 pointer-events-none">
        <nav className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-2xl ${
          scrolled 
            ? "bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg py-3 px-4 md:px-6" 
            : "bg-white/95 backdrop-blur-md border border-gray-100 shadow-sm py-4 px-4 md:px-6"
        }`}>
          <div className="flex justify-between items-center">
            
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 group z-50 focus:outline-none rounded-lg pr-2">
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

              <button className="hidden sm:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all" aria-label="User Profile">
                <User size={20} />
              </button>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all group" aria-label="Shopping Cart">
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
                onClick={() => setIsMobileOpen(!isMobileOpen)} 
                className="md:hidden p-2 text-gray-900 bg-gray-100 rounded-full ml-1 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                aria-label={isMobileOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-white pt-28 px-6 pb-6 flex flex-col overflow-y-auto h-screen"
          >
            <form onSubmit={handleSearch} className="relative w-full mb-8">
              <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-gray-900">
                <Search size={20} />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 text-lg outline-none font-medium focus:ring-4 focus:ring-gray-200 transition-all"
                autoFocus 
              />
            </form>
            
            <div className="flex flex-col gap-6 text-2xl font-black text-gray-900">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="pb-4 border-b border-gray-100 flex justify-between items-center group">
                Home <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors"/>
              </Link>
              <Link to="/stores/mens clothing" onClick={() => setIsMobileOpen(false)} className="pb-4 border-b border-gray-100 flex justify-between items-center group">
                Men's Fashion <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors"/>
              </Link>
              <Link to="/stores/womens clothing" onClick={() => setIsMobileOpen(false)} className="pb-4 border-b border-gray-100 flex justify-between items-center group">
                Women's Fashion <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors"/>
              </Link>
              <Link to="/stores/electronics" onClick={() => setIsMobileOpen(false)} className="pb-4 border-b border-gray-100 flex justify-between items-center group">
                Electronics <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors"/>
              </Link>
              
              <Link to="/vendor" onClick={() => setIsMobileOpen(false)} className="pt-4 text-blue-600 flex justify-between items-center">
                Vendor Dashboard <Store size={24} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}