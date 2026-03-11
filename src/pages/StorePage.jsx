import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { api } from "../services/api";
import { AlertTriangle, Home, ChevronRight, SlidersHorizontal, ArrowUpDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StorePage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  const CONVERSION_RATE = 83;

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/products/category/${id}`);
        if (isMounted) {
          const apiProducts = response.data.map(p => ({
            ...p,
            price: Math.round(p.price * CONVERSION_RATE),
            isVendor: false
          }));

          const savedVendorData = localStorage.getItem("vendorInventory");
          const vendorProducts = (savedVendorData ? JSON.parse(savedVendorData) : []).map(p => ({
            ...p,
            isVendor: true
          }));

          const matchedVendorProducts = vendorProducts.filter(
            item => item.category.toLowerCase() === id.toLowerCase()
          );

          setProducts([...matchedVendorProducts, ...apiProducts]);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
    return () => { isMounted = false; };
  }, [id]);

  let displayedProducts = [...products];

  if (priceFilter === "under500") displayedProducts = displayedProducts.filter(p => p.price < 500);
  if (priceFilter === "500to2000") displayedProducts = displayedProducts.filter(p => p.price >= 500 && p.price <= 2000);
  if (priceFilter === "over2000") displayedProducts = displayedProducts.filter(p => p.price > 2000);

  if (sortBy === "price-asc") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") displayedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      // THE FIX: pt-32 (mobile) and lg:pt-40 (desktop) clears the fixed navbar perfectly
      className="pb-20 pt-32 lg:pt-40 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen"
    >
      {/* 1. BREADCRUMBS (Safe Area) */}
      <nav className="flex items-center text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors font-medium">
          <Home size={14} /> Home
        </Link>
        <ChevronRight size={14} className="mx-3 opacity-40" />
        <span className="capitalize text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-full">{id} Store</span>
      </nav>

      {/* 2. PREMIUM HEADER BANNER */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-8 md:p-14 mb-12 overflow-hidden shadow-2xl isolate">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 blur-[100px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -z-10 rounded-full"></div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block border border-blue-500/20"
          >
            Premium Department
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-black text-white capitalize mb-6 tracking-tighter leading-none">
            {id}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            Discover the finest selection of {id} products. Curated for quality and delivered with speed.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        
        {/* 3. STICKY SIDEBAR FILTERS */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0">
          {/* sticky top-36 ensures it stays below the navbar as you scroll */}
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-36">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <SlidersHorizontal size={20} className="text-blue-600" /> Filters
            </h3>
            
            <div className="space-y-8">
              <div>
                <p className="font-black text-gray-400 mb-5 text-[10px] uppercase tracking-widest">Price Range</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under500", label: "Under ₹500" },
                    { id: "500to2000", label: "₹500 - ₹2000" },
                    { id: "over2000", label: "Over ₹2000" },
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => setPriceFilter(opt.id)}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                        priceFilter === opt.id 
                        ? 'bg-gray-900 text-white shadow-xl translate-x-1' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:translate-x-1'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MAIN PRODUCT GRID SECTION */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <p className="text-gray-400 font-medium">Showing <span className="text-gray-900 font-black">{displayedProducts.length}</span> results</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100 group transition-all focus-within:ring-4 focus-within:ring-gray-100">
              <ArrowUpDown size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors"/>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="outline-none bg-transparent text-sm font-bold cursor-pointer text-gray-800"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : displayedProducts.map((product) => (
                <motion.div 
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id} className="relative"
                >
                  {product.isVendor && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                      <Zap size={10} fill="white"/> VERIFIED VENDOR
                    </div>
                  )}
                  <ProductCard product={{ ...product, name: product.title, storeName: id }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}