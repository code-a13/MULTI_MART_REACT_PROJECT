import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, User, CheckCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ fullName: "", address: "" });
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault(); 
    
    // Simulate Order API Call
    setIsSuccess(true);

    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" }); 
      navigate("/");
    }, 2500);
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty, macha!</h2>
        <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Go back to MegaMall
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-20 flex flex-col items-center justify-center"
      >
        <CheckCircle size={80} className="text-green-500 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-500 mt-2">Redirecting to home...</p>
      </motion.div>
    );
  }

  return (
    <div className="py-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Left: Checkout Form */}
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="text-blue-600" /> Shipping Details
        </h2>
        
        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="Aditya..." 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea 
              required rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Your full address here..." 
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            <CreditCard size={24} /> Pay ₹{total} Securely
          </motion.button>
          
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-4">
            <ShieldCheck size={14}/> 256-bit Encrypted Checkout
          </p>
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} <span className="font-bold">x{item.qty}</span></span>
              <span className="font-bold text-gray-800">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-extrabold text-blue-600">₹{total}</span>
        </div>
      </div>
    </div>
  );
}