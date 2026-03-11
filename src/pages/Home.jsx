import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowRight, AlertTriangle, RefreshCw, Zap, TrendingUp, Sparkles, Watch } from "lucide-react";
import { api } from "../services/api";
import { motion } from "framer-motion";

// --- DATA STRUCTURES ---

// Images for the large square carousel
const heroCarouselImages = [
  "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200", 
  "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200", 
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200"
];

const flashDeals = [
  { 
    id: "men's clothing", 
    badge: "bg-red-500", badgeText: "Save 40%", 
    title: "Streetwear Drop",
    desc: "Upgrade today with massive discounts.",
    image: "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Zap size={20} className="text-yellow-400" />
  },
  { 
    id: "women's clothing",
    badge: "bg-amber-500", badgeText: "New Arrivals", 
    title: "Summer Styles",
    desc: "Shine bright with our latest collection.",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <TrendingUp size={20} className="text-amber-400" />
  },
  { 
    id: "electronics",
    badge: "bg-indigo-600", badgeText: "Min. 50% Off", 
    title: "Tech Clearance",
    desc: "Top gadgets from premium brands.",
    image: "https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Sparkles size={20} className="text-indigo-400" />
  }
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroCarouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
  };

  if (error) {
    return (
      <main className="py-20 flex flex-col justify-center items-center text-red-500 min-h-[60vh]">
        <AlertTriangle size={48} className="mb-4 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
        <button onClick={fetchStores} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold mt-4 focus:ring-4 focus:ring-gray-300">
          <RefreshCw size={18} /> Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col gap-12 md:gap-20 overflow-x-hidden">
      
      {/* --- 1. NEW TOP SECTION: BENTO BOX HERO GRID --- */}
      <section className="w-full" aria-label="Featured Promotions">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-[600px]">
          
          {/* LEFT SIDE: Two Stacked Rectangles */}
          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-1 order-2 lg:order-1 h-[600px] lg:h-auto">
            
            {/* Top Rectangle: Gadgets */}
            <Link to="/stores/electronics" className="relative flex-1 rounded-[2rem] overflow-hidden group shadow-lg isolate focus:outline-none focus:ring-4 focus:ring-blue-300 block">
              <img 
                src="https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Camera" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 -z-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent -z-10"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="bg-white/90 text-gray-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max mb-3 shadow-sm">Trending</span>
                <h2 className="text-2xl font-black text-white leading-tight mb-2">Next-Gen Gadgets</h2>
                <span className="inline-flex items-center gap-2 font-bold text-white group-hover:text-blue-300 transition-colors w-max text-sm">
                  Shop Electronics <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Bottom Rectangle: Jewelery / Accessories */}
            <Link to="/stores/jewelery" className="relative flex-1 rounded-[2rem] overflow-hidden group shadow-lg isolate focus:outline-none focus:ring-4 focus:ring-blue-300 block bg-stone-900">
              <img 
                src="https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Accessories" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 -z-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent -z-10"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="bg-stone-100 text-stone-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-max mb-3 shadow-sm flex items-center gap-1">
                  <Watch size={12} /> Premium
                </span>
                <h2 className="text-2xl font-black text-white leading-tight mb-2">Luxury Accessories</h2>
                <span className="inline-flex items-center gap-2 font-bold text-white group-hover:text-amber-300 transition-colors w-max text-sm">
                  Shop Jewelry <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

          </div>

          {/* RIGHT SIDE: Large Square Carousel */}
          <div className="lg:col-span-2 relative rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 order-1 lg:order-2 h-[400px] sm:h-[500px] lg:h-auto isolate">
            
            {/* Carousel Track */}
            <div 
              className="absolute inset-0 flex transition-transform duration-1000 ease-in-out -z-20"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {heroCarouselImages.map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  alt={`Slide ${index}`} 
                  className="w-full h-full object-cover flex-shrink-0 opacity-70"
                />
              ))}
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent -z-10"></div>
            
            {/* Content Over Carousel */}
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span className="bg-blue-600 text-white text-[10px] md:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-max mb-6 shadow-lg inline-block">
                  Flagship Experience
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-none">
                  Welcome to <br/> Multi-Mart.
                </h1>
                <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed max-w-md hidden sm:block">
                  Shop thousands of premium products from top global vendors. Handpicked quality and lightning-fast delivery.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/stores/men's clothing" className="bg-white hover:bg-gray-100 text-gray-900 px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold transition-all shadow-xl flex items-center gap-2 focus:ring-4 focus:ring-gray-300 outline-none text-sm md:text-base">
                    Start Shopping <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-6 md:bottom-8 left-8 md:left-16 flex gap-2 z-20">
              {heroCarouselImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-8 bg-white" : "w-2 md:w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- 2. MIDDLE SECTION: FLASH DEALS WITH IMAGES --- */}
      <section aria-labelledby="deals-heading">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 id="deals-heading" className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Flash Deals & Offers
          </h2>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hidden sm:block">Ends soon!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flashDeals.map((deal) => (
            <Link 
              key={deal.id} 
              to={`/stores/${deal.id}`} 
              className="block group focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-[2rem]"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 p-8 min-h-[300px] md:min-h-[350px] flex flex-col justify-end isolate bg-gray-900 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 -z-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent -z-10"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`${deal.badge} text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                      {deal.badgeText}
                    </span>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-full shadow-inner">
                      {deal.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                    {deal.desc}
                  </p>
                </div>

                <div className="relative z-10 flex items-center text-white font-bold text-sm md:text-base">
                  Shop Deal <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- 3. BOTTOM SECTION: EXPLORE ALL STORES DIRECTORY --- */}
      <section aria-labelledby="catalog-heading" className="pt-8 border-t border-gray-100">
        <div className="flex flex-col mb-10 px-2 text-center items-center">
          <h2 id="catalog-heading" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Explore All Stores</h2>
          <p className="text-gray-500 mt-3 text-base md:text-lg max-w-2xl">Browse our complete catalog to find exactly what you are looking for.</p>
        </div>

        <motion.div 
          key={categories.length > 0 ? "loaded" : "loading"} 
          variants={containerVariants}
          initial="hidden"
          whileInView="show" 
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading 
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={`skel-${index}`} className="bg-gray-100 p-6 rounded-3xl animate-pulse h-48"></div>
              ))
            : categories.map((category) => (
              <motion.div key={category} variants={itemVariants}>
                <Link 
                  to={`/stores/${category}`} 
                  className="block group h-full focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl"
                  aria-label={`Enter ${category} store`}
                >
                  <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center gap-5 group-hover:-translate-y-2 h-full min-h-[220px]">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl text-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-6">
                      <Store size={40} aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 capitalize mb-2 group-hover:text-blue-600 transition-colors">{category}</h3>
                      <span className="inline-flex items-center gap-1 text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Enter Store <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          }
        </motion.div>
      </section>
      
    </main>
  );
}