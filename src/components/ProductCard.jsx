import { motion } from "framer-motion";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const { dispatch } = useContext(CartContext);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between"
    >
      <img 
        src={product.image || "https://via.placeholder.com/150"} 
        alt={product.name} 
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      <div>
        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{product.storeName}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-extrabold text-blue-600">₹{product.price}</span>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition flex items-center"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}