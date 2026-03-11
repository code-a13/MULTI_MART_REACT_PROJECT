import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash2, ShoppingBag, ShieldCheck, ArrowRight, QrCode, CreditCard, Loader2, Store, ShoppingCart } from "lucide-react";import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, dispatch } = useContext(CartContext);
  
  const [paymentMethod, setPaymentMethod] = useState("upi"); 
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRemove = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
    toast.info(`${product.name.substring(0, 15)}... removed from cart.`);
  };

  // Math Calculations (NATIVELY IN INR ₹)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05; // 5% tax
  const totalINR = subtotal + tax;

  // The exact URI format mandated by the Indian Government (NPCI)
  const myUPI_ID = "positivevibesa13@okaxis"; 
  const storeName = "Multi-Mart-React";
  const upiString = `upi://pay?pa=${myUPI_ID}&pn=${storeName}&am=${totalINR.toFixed(2)}&cu=INR`;

  const handleSimulateUPIVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("UPI Payment Received Successfully! Order Confirmed.");
      cart.forEach(item => dispatch({ type: "REMOVE_FROM_CART", payload: item }));
    }, 3000);
  };

  // PROFESSIONAL EMPTY STATE
  if (cart.length === 0) {
    return (
      // FIX: Added pt-32 to clear the fixed navbar
      <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center min-h-[80vh] text-center bg-gray-50/30">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-10 rounded-full shadow-sm border border-gray-100 mb-8"
        >
          <ShoppingBag size={100} className="text-blue-100" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your cart is empty !</h2>
        <p className="text-gray-500 mb-10 max-w-md text-lg">Looks like you haven't added anything yet. Explore our top categories and find something you love.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md flex items-center gap-3">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  // ACTIVE CART STATE
  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      {/* FIX: Added pt-28 md:pt-32 to clear the fixed navbar */}
      <div className="pt-28 md:pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
            <ShoppingCart size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Secure Checkout</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 text-lg">Cart Items ({cart.length})</h2>
                <span className="text-sm font-medium text-gray-500">Ships from Multi-Mart Verified Vendors</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    key={item.id} 
                    className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-white rounded-2xl p-2 flex-shrink-0 border border-gray-200 shadow-sm overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow text-center sm:text-left flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                          <span className="text-[10px] font-black bg-blue-100 text-blue-700 uppercase tracking-wider px-2 py-1 rounded-md">
                            {item.storeName || item.category || "Premium"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 hover:text-blue-600 cursor-pointer transition-colors">{item.name}</h3>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-auto">
                        <p className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-lg">Qty: <span className="font-bold text-gray-900">{item.qty}</span></p>
                        <button 
                          onClick={() => handleRemove(item)} 
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Trash2 size={18} /> <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex flex-col items-center sm:items-end gap-1 min-w-[120px]">
                      <span className="font-black text-2xl text-gray-900 tracking-tight">₹{(item.price * item.qty).toFixed(2)}</span>
                      <span className="text-xs text-gray-500 font-medium line-through">₹{((item.price * item.qty) * 1.2).toFixed(2)}</span>
                      <span className="text-xs font-bold text-emerald-600 mt-1">20% Off Applied</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Checkout (Sticky) */}
          <div className="w-full lg:w-1/3 sticky top-32">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                Order Summary
              </h2>
              
              <div className="space-y-4 text-gray-600 mb-6 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-gray-900 text-base">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">- ₹0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-gray-900 text-base">₹{tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-800">Total Due</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-gray-900 block tracking-tight">₹{totalINR.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">Includes all taxes & fees</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD TOGGLE */}
              <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${paymentMethod === "upi" ? "bg-white text-blue-700 shadow-md border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                  <QrCode size={18} /> UPI QR
                </button>
                <button 
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all duration-300 ${paymentMethod === "paypal" ? "bg-white text-blue-700 shadow-md border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                  <CreditCard size={18} /> PayPal
                </button>
              </div>
              
              {/* DYNAMIC CHECKOUT SECTION */}
              <div className="min-h-[250px]">
                {paymentMethod === "paypal" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-0">
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "rect", color: "blue", height: 48 }}
                      createOrder={(data, actions) => {
                        const convertedUSD = (totalINR / 83).toFixed(2);
                        return actions.order.create({ purchase_units: [{ amount: { value: convertedUSD } }] });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          toast.success(`Payment successful! Thank you, ${details.payer.name.given_name}.`);
                          cart.forEach(item => dispatch({ type: "REMOVE_FROM_CART", payload: item }));
                        });
                      }}
                    />
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-bold bg-blue-50 py-2 rounded-lg">
                      <ShieldCheck size={16} className="text-blue-600" /> Secured by PayPal Global
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center bg-white p-6 rounded-2xl border-2 border-gray-100 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                    
                    <p className="text-sm font-bold text-gray-800 mb-4 text-center">Scan with GPay, PhonePe, or Paytm</p>
                    
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-200 mb-6 relative">
                      {/* Corner Accents for QR */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-600"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-600"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-600"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-600"></div>
                      
                      <QRCode value={upiString} size={180} level="H" />
                    </div>

                    <button 
                      onClick={handleSimulateUPIVerification}
                      disabled={isVerifying}
                      className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:active:scale-100"
                    >
                      {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      {isVerifying ? "Verifying Bank..." : "I have completed payment"}
                    </button>
                  </motion.div>
                )}
              </div>
              
            </div>
            
            {/* Trust Badges */}
            <div className="mt-6 flex justify-center items-center gap-6 text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col items-center gap-1">
                <Store size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </PayPalScriptProvider>
  );
}