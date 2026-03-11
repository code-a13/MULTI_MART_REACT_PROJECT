import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Star, Check } from "lucide-react";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { dispatch } = useContext(CartContext);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name.substring(0, 15)}... added to cart!`);
  };

  // Extract rating safely
  const rating = product.rating?.rate || 4.5;
  const reviews = product.rating?.count || 120;
  
  // THE FIX: Use the formatted string from StorePage!
  // Fallback to a basic string just in case formattedPrice is missing
  const displayPrice = product.formattedPrice || `₹${product.price}`;

  // Create a fake original price (20% higher) using the raw number, and format it to INR
  const rawOriginalPrice = product.price * 1.2;
  const displayOriginalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rawOriginalPrice);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col h-full relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      
      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
        Sale
      </div>

      <div className="h-48 w-full bg-white flex items-center justify-center mb-5 overflow-hidden rounded-xl group-hover:opacity-90 transition-opacity">
        <img 
          src={product.image || "https://via.placeholder.com/150"} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
          {product.storeName || "MegaMall"}
        </p>
        
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-700">{rating}</span>
          <span className="text-xs text-blue-500 font-medium hover:underline cursor-pointer">({reviews} ratings)</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            {/* THE FIX: Removed the hardcoded $ symbols here */}
            <p className="text-xs text-gray-400 line-through mb-0.5">{displayOriginalPrice}</p>
            <span className="text-2xl font-extrabold text-gray-900">{displayPrice}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2 shadow-md hover:shadow-blue-500/30"
          >
            <ShoppingCart size={18} />
            <span className="text-sm font-bold hidden sm:block">Add</span>
          </button>
        </div>
        
        <div className="mt-3 flex items-center gap-1 text-[11px] font-extrabold text-green-600 uppercase tracking-wide">
          <Check size={14} strokeWidth={3} /> In Stock & Prime
        </div>
      </div>
    </div>
  );
}