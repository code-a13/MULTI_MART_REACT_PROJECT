import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash2, ShoppingBag, ShieldCheck, ArrowRight, QrCode, CreditCard, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import QRCode from "react-qr-code"; // NEW: QR Code Generator

export default function CartPage() {
  const { cart, dispatch } = useContext(CartContext);
  
  // State to toggle between PayPal and UPI QR
  const [paymentMethod, setPaymentMethod] = useState("upi"); 
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRemove = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
    toast.info(`${product.name.substring(0, 15)}... removed from cart.`);
  };

  // Math Calculations (USD)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const totalUSD = subtotal + tax;

  // UPI Calculation (Assuming 1 USD = 83 INR for demonstration)
  const conversionRate = 83;
  const totalINR = Math.round(totalUSD * conversionRate);

  // 🔴 IMPORTANT: Replace this with your actual GPay/PhonePe UPI ID!
  // Example: "9876543210@ybl" or "aditya@okhdfcbank"
  const myUPI_ID = "aditya@okicici"; 
  const storeName = "MegaMall_React";
  
  // The exact URI format mandated by the Indian Government (NPCI)
  const upiString = `upi://pay?pa=${myUPI_ID}&pn=${storeName}&am=${totalINR}&cu=INR`;

  // Simulate Backend Webhook Verification
  const handleSimulateUPIVerification = () => {
    setIsVerifying(true);
    // Fake a 3-second network delay to simulate checking the bank servers
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("UPI Payment Received Successfully! Order Confirmed.");
      cart.forEach(item => dispatch({ type: "REMOVE_FROM_CART", payload: item }));
    }, 3000);
  };

  // EMPTY STATE UI
  if (cart.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-50 p-8 rounded-full mb-6">
          <ShoppingBag size={80} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Your cart is empty, macha!</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our top categories and find something you love.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
      <div className="py-10 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-700">Cart Items ({cart.length})</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">{item.storeName}</p>
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Quantity: <span className="font-bold text-gray-800">{item.qty}</span></p>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-3 min-w-[100px]">
                      <span className="font-extrabold text-xl text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                      <button 
                        onClick={() => handleRemove(item)} 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Checkout */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-gray-900 block">${totalUSD.toFixed(2)}</span>
                    <span className="text-sm font-bold text-green-600">≈ ₹{totalINR} INR</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD TOGGLE */}
              <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all ${paymentMethod === "upi" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <QrCode size={16} /> UPI QR
                </button>
                <button 
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex justify-center items-center gap-2 transition-all ${paymentMethod === "paypal" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <CreditCard size={16} /> PayPal
                </button>
              </div>
              
              {/* DYNAMIC CHECKOUT SECTION */}
              <div className="min-h-[250px]">
                {paymentMethod === "paypal" ? (
                  <div className="animate-fade-in relative z-0">
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "rect", color: "blue" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({ purchase_units: [{ amount: { value: totalUSD.toFixed(2) } }] });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          toast.success(`Payment successful! Thank you, ${details.payer.name.given_name}.`);
                          cart.forEach(item => dispatch({ type: "REMOVE_FROM_CART", payload: item }));
                        });
                      }}
                    />
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                      <ShieldCheck size={16} className="text-blue-500" /> Secured by PayPal Global
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in flex flex-col items-center bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-4 text-center">Scan with GPay, PhonePe, or Paytm</p>
                    
                    {/* SCANNABLE QR CODE */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                      <QRCode value={upiString} size={180} level="H" />
                    </div>

                    <button 
                      onClick={handleSimulateUPIVerification}
                      disabled={isVerifying}
                      className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition-colors disabled:bg-green-400"
                    >
                      {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                      {isVerifying ? "Verifying Bank..." : "I have completed payment"}
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </PayPalScriptProvider>
  );
}