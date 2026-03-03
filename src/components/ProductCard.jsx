import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const { dispatch } = useContext(CartContext);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  // Extract rating safely (fallback to 0 if API doesn't have it)
  const rating = product.rating?.rate || 4.5;
  const reviews = product.rating?.count || 120;

  return (
    <motion.div 
      whileHover={{ y: -5, shadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col h-full relative group"
    >
      <div className="h-48 w-full bg-white flex items-center justify-center mb-4 overflow-hidden rounded-xl">
        <img 
          src={product.image || "https://via.placeholder.com/150"} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">{product.storeName}</p>
        
        {/* Line-clamp-2 truncates long titles automatically */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 leading-tight">
          {product.name}
        </h3>
        
        {/* The Basic Details: Rating & Description */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">({reviews} reviews)</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {product.description || "High-quality premium product available now at MegaMall stores."}
        </p>

        {/* Pushes price and button to the very bottom */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-gray-900">₹{product.price}</span>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-md"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}