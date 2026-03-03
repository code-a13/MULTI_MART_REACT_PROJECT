import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, Loader, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "../services/api";
import { motion } from "framer-motion";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/products/categories");
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* ENTERPRISE HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-10 md:p-16 mb-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between"
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            The Ultimate <span className="text-yellow-400">Multi-Vendor</span> Marketplace.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8">
            Shop from top brands, manage your own store, and experience enterprise-grade e-commerce.
          </p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2">
            Start Shopping <ArrowRight size={20} />
          </button>
        </div>
        <div className="hidden md:block">
          <ShoppingBag size={150} className="text-blue-400 opacity-50" />
        </div>
      </motion.div>

      <div className="flex justify-between items-end mb-8 px-2">
        <h2 className="text-3xl font-bold text-gray-800">Explore Stores</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            key={index}
          >
            <Link to={`/stores/${category}`} className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center gap-4 group-hover:-translate-y-2 transform duration-300 h-full">
                <div className="bg-blue-50 p-5 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Store size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 capitalize mb-1">{category}</h3>
                  <span className="text-blue-500 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full">Enter Store</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}