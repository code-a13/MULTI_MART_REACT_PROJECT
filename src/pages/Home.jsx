import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowRight, AlertTriangle, Zap, Tag, Star } from "lucide-react";
import { api } from "../services/api";
import { motion } from "framer-motion";

// 1. DYNAMIC FEATURE: Highly Stable Pexels Images
const carouselImages = [
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600", // Mens clothing
  "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",   // Camera
  "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600", // Phone
  "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",// Bags
  "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",         // Shoes
  "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=600"  // Cycle
];

const doubledImages = [...carouselImages, ...carouselImages];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStores = async () => {
      try {
        const response = await api.get("/products/categories");
        if (isMounted) {
          setCategories(response.data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };
    
    fetchStores();
    return () => { isMounted = false; };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
  };

  const CategorySkeleton = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 animate-pulse h-full">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-blue-100 rounded-full w-24 mt-auto"></div>
    </div>
  );

  const promoStyles = [
    { 
      bg: "bg-gradient-to-br from-gray-900 to-gray-800", text: "text-white", 
      badge: "bg-red-500", badgeText: "Save 40%", accent: "text-blue-400",
      desc: "Upgrade today with massive discounts."
    },
    { 
      bg: "bg-gradient-to-br from-amber-50 to-orange-50", text: "text-gray-900", 
      badge: "bg-amber-500", badgeText: "New Arrivals", accent: "text-amber-600",
      desc: "Shine bright with our latest festive collection."
    },
    { 
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50", text: "text-gray-900", 
      badge: "bg-indigo-600", badgeText: "Min. 50% Off", accent: "text-indigo-600",
      desc: "Top styles from premium brands just for you."
    }
  ];

  if (error) {
    return (
      <div className="py-20 flex flex-col justify-center items-center text-red-500 min-h-[60vh]">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-2xl font-bold">Failed to connect to marketplace.</h2>
        <p className="text-gray-500">Please check your network and try again.</p>
      </div>
    );
  }

  return (
    <div className="pb-10 max-w-7xl mx-auto px-4 pt-2">
      
      {/* 1. INFINITE CAMERA ROLL SECTION */}
      <div className="mb-12 relative overflow-hidden flex flex-col items-center max-w-[100vw] -mx-4 md:mx-0">
        <div className="absolute top-0 left-0 w-16 md:w-40 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 md:w-40 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          // THE FIX: Removed 'gap-4 md:gap-6' from here to fix the math!
          className="flex w-max py-4" 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 30, repeat: Infinity }} 
        >
          {doubledImages.map((src, idx) => (
            // THE FIX: Added padding here instead to create the space. Math is now 100% perfect!
            <div key={idx} className="px-2 md:px-3">
              <div className="w-64 md:w-80 h-40 md:h-56 rounded-3xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 group relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
                <img 
                  src={src} 
                  alt={`Trending product ${idx}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  // Enterprise Safety: If an image ever fails, show a placeholder instead of breaking!
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=MegaMall" }} 
                />
                <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur text-gray-900 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Zap size={12} className="text-yellow-500" /> Trending
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. DYNAMIC SALES POSTERS */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6 flex items-center gap-2 px-2">
          Flash Deals & Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => <CategorySkeleton key={`promo-skel-${i}`} />)
          ) : (
             categories.slice(0, 3).map((category, index) => {
               const style = promoStyles[index]; 
               return (
                  <Link key={`promo-${category}`} to={`/stores/${category}`} className="block group h-full">
                    <div className={`${style.bg} rounded-3xl p-8 h-full min-h-[200px] flex flex-col justify-between relative overflow-hidden shadow-lg group-hover:-translate-y-1 transition-transform duration-300`}>
                      <div className="relative z-10">
                        <span className={`${style.badge} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-md`}>
                          {style.badgeText}
                        </span>
                        <h3 className={`text-2xl font-extrabold ${style.text} mb-2 leading-tight capitalize`}>
                          {category}
                        </h3>
                        <p className={`text-sm mb-4 line-clamp-2 ${style.text === 'text-white' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {style.desc}
                        </p>
                      </div>
                      <div className={`relative z-10 flex items-center ${style.accent} font-bold mt-auto`}>
                        Shop Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
               );
             })
          )}
        </div>
      </div>

      {/* 3. DYNAMIC CATEGORY GRID */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Explore All Stores</h2>
          <p className="text-gray-500 mt-1 text-sm">Browse our complete catalog</p>
        </div>
      </div>

      <motion.div 
        key={categories.length > 0 ? "loaded" : "loading"} 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {loading 
          ? Array.from({ length: 4 }).map((_, index) => (
              <motion.div key={`grid-skel-${index}`} variants={itemVariants}>
                 <CategorySkeleton />
              </motion.div>
            ))
          : categories.map((category) => (
            <motion.div key={category} variants={itemVariants}>
              <Link to={`/stores/${category}`} className="block group h-full">
                <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center gap-5 group-hover:-translate-y-2 h-full">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl text-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                    <Store size={40} />
                  </div>
                  <div className="text-center mt-auto">
                    <h3 className="text-xl font-bold text-gray-800 capitalize mb-3 group-hover:text-blue-600 transition-colors">{category}</h3>
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-bold bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-100 transition-colors">
                      Enter Store <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        }
      </motion.div>
    </div>
  );
}