import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { api } from "../services/api";
import { AlertTriangle, Home, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function StorePage() {
  const { id } = useParams();
  
  // API States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/products/category/${id}`);
        if (isMounted) {
          setProducts(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching products:", error);
          setError(true);
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
    return () => { isMounted = false; };
  }, [id]);

  // ENGINE: Client-Side Filtering & Sorting
  let displayedProducts = [...products];

  // 1. Apply Filters
  if (priceFilter === "under50") displayedProducts = displayedProducts.filter(p => p.price < 50);
  if (priceFilter === "50to100") displayedProducts = displayedProducts.filter(p => p.price >= 50 && p.price <= 100);
  if (priceFilter === "over100") displayedProducts = displayedProducts.filter(p => p.price > 100);

  // 2. Apply Sorting
  if (sortBy === "price-asc") displayedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") displayedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") displayedProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

  if (error) {
    return (
      <div className="py-20 flex flex-col justify-center items-center text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-2xl font-bold">Oops! Failed to load products.</h2>
        <p className="text-gray-500">Please check your internet connection or try again.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* 1. AMAZON-STYLE BREADCRUMBS */}
      <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          <Home size={16} /> Home
        </Link>
        <ChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Stores</span>
        <ChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="text-gray-900 capitalize font-bold">{id}</span>
      </nav>

      {/* 2. CATEGORY HEADER BANNER */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 mb-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold capitalize mb-2">{id}</h1>
          <p className="text-blue-200">Shop the best and highest quality items from this category.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 3. SIDEBAR: FILTERS (Left Column) */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <SlidersHorizontal size={20} className="text-blue-600"/> Filters
            </h3>
            
            <div className="space-y-4">
              <p className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Price Range</p>
              <div className="flex flex-col gap-3">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under50", label: "Under $50" },
                  { id: "50to100", label: "$50 to $100" },
                  { id: "over100", label: "Over $100" },
                ].map((filterOption) => (
                  <label key={filterOption.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="price" 
                      value={filterOption.id}
                      checked={priceFilter === filterOption.id}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${priceFilter === filterOption.id ? 'text-blue-600 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {filterOption.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. MAIN CONTENT (Right Column) */}
        <div className="w-full lg:w-3/4">
          
          {/* TOP BAR: Result Count & Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
            <p className="text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{loading ? "..." : displayedProducts.length}</span> results for <span className="capitalize font-bold text-gray-900">{id}</span>
            </p>
            
            <div className="flex items-center gap-3">
              <ArrowUpDown size={18} className="text-gray-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none cursor-pointer font-medium transition-all hover:bg-gray-100"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{ ...product, name: product.title, storeName: id }} 
                />
              ))
            ) : (
              // EMPTY STATE UI
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <AlertTriangle size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 max-w-sm">Try adjusting your filters or selecting a different price range to see more results.</p>
                <button 
                  onClick={() => setPriceFilter("all")}
                  className="mt-6 bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}