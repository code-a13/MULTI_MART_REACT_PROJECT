import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { api } from "../services/api";
import { AlertTriangle, Home, ChevronRight, SlidersHorizontal, ArrowUpDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// UTILITY FUNCTION: Defined outside the component to prevent unnecessary recreations on re-render
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function StorePage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  const CONVERSION_RATE = 83; // 1 USD = 83 INR

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/products/category/${id}`);
        
        if (isMounted) {
          // 1. Process API Data (Convert USD to INR & Format)
          const apiProducts = response.data.map(p => {
            const rawInrPrice = Math.round(p.price * CONVERSION_RATE);
            return {
              ...p,
              price: rawInrPrice,               // Keep raw number for math/sorting/filtering
              formattedPrice: formatINR(rawInrPrice), // Create presentation string for the UI
              isVendor: false
            };
          });

          // 2. Process Local Vendor Data
          const savedVendorData = localStorage.getItem("vendorInventory");
          let vendorProducts = [];
          
          if (savedVendorData) {
             vendorProducts = JSON.parse(savedVendorData).map(p => {
               // Assuming vendor prices also need conversion. If they are already in INR, remove the * CONVERSION_RATE
               const rawInrPrice = Math.round(p.price * CONVERSION_RATE); 
               return {
                 ...p,
                 price: rawInrPrice,
                 formattedPrice: formatINR(rawInrPrice),
                 isVendor: true
               };
             });
          }

          const matchedVendorProducts = vendorProducts.filter(
            item => item.category.toLowerCase() === id.toLowerCase()
          );

          // Merge: New items first (Vendor)
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

  // Filtering Logic (Uses the raw numerical 'price')
  if (priceFilter === "under500") displayedProducts = displayedProducts.filter(p => p.price < 500);
  if (priceFilter === "500to2000") displayedProducts = displayedProducts.filter(p => p.price >= 500 && p.price <= 2000);
  if (priceFilter === "over2000") displayedProducts = displayedProducts.filter(p => p.price > 2000);

  // Sorting Logic (Uses the raw numerical 'price')
  if (sortBy === "price-asc") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") displayedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="py-8 px-4 max-w-7xl mx-auto"
    >
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-blue-600 flex items-center gap-1 transition-all"><Home size={14} /> Home</Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="capitalize text-gray-900 font-bold">{id} Store</span>
      </nav>

      {/* 2. HEADER BANNER */}
      <div className="relative bg-gray-900 rounded-[2rem] p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[120px] opacity-30"></div>
        <div className="relative z-10">
          <motion.span 
            initial={{ x: -20 }} animate={{ x: 0 }}
            className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block"
          >
            Exclusive Collection
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-black text-white capitalize mb-4 tracking-tight">{id}</h1>
          <p className="text-gray-400 text-lg max-w-md">The most premium items in {id}, handpicked for you. Now with localized pricing.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* 3. SIDEBAR FILTERS */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="font-bold text-gray-800 mb-4 text-sm uppercase">Price Range</p>
                <div className="space-y-3">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under500", label: "Under ₹500" },
                    { id: "500to2000", label: "₹500 to ₹2000" },
                    { id: "over2000", label: "Over ₹2000" },
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => setPriceFilter(opt.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${priceFilter === opt.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MAIN GRID */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-gray-500 font-medium">Found <span className="text-gray-900 font-bold">{displayedProducts.length}</span> results</p>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
              <ArrowUpDown size={16} className="text-gray-400"/>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="outline-none bg-transparent text-sm font-bold cursor-pointer">
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              ) : displayedProducts.map((product) => (
                <motion.div 
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id} className="relative group"
                >
                  {product.isVendor && (
                    <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Zap size={10} fill="white"/> LOCAL VENDOR
                    </div>
                  )}
                  {/* IMPORTANT: ProductCard now receives a product object that contains BOTH .price and .formattedPrice */}
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