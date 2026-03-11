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
      className="pb-20 pt-32 lg:pt-40 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen"
    >
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-gray-900 flex items-center gap-1.5 transition-colors font-semibold">
          <Home size={16} className="text-gray-500" /> Home
        </Link>
        <ChevronRight size={14} className="mx-2 text-gray-300" />
        <span className="capitalize text-gray-800 font-bold">{id}</span>
      </nav>

      {/* 2. PREMIUM ENTERPRISE BANNER - COMPACT VERSION */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-200/60 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-[0.97]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

        {/* THE FIX: Reduced paddings and min-heights here! */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-8 md:py-10 min-h-[160px] md:min-h-[200px]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-6 bg-blue-500 rounded-full"></span>
              <span className="text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
                Premium Collection
              </span>
            </div>
            
            {/* THE FIX: Adjusted text size to match the smaller box */}
            <h1 className="text-3xl md:text-5xl font-black text-white capitalize mb-2 tracking-tight leading-none">
              {id} <span className="text-gray-400 font-light hidden sm:inline-block">| Shop</span>
            </h1>
            
            <p className="text-gray-300 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              Explore our curated selection of high-quality {id}. Designed for performance and built to last.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
        
        {/* 3. SIDEBAR FILTERS */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 sticky top-32">
            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <SlidersHorizontal size={18} className="text-gray-500" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="font-bold text-gray-900 mb-4 text-sm">Price Range</p>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under500", label: "Under ₹500" },
                    { id: "500to2000", label: "₹500 - ₹2000" },
                    { id: "over2000", label: "Over ₹2000" },
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => setPriceFilter(opt.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        priceFilter === opt.id 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-gray-100">
            <p className="text-gray-500 font-medium text-sm">
              Showing <span className="text-gray-900 font-bold">{displayedProducts.length}</span> results
            </p>
            
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-gray-300 transition-colors">
              <ArrowUpDown size={14} className="text-gray-400"/>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="outline-none bg-transparent text-sm font-semibold cursor-pointer text-gray-700"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : displayedProducts.map((product) => (
                <motion.div 
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={product.id} className="relative h-full"
                >
                  {product.isVendor && (
                    <div className="absolute top-3 left-3 z-20 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-md shadow-sm flex items-center gap-1 tracking-wider">
                      <Zap size={10} fill="white"/> VERIFIED
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