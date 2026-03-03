import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, dispatch } = useContext(CartContext);

  const handleRemove = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return <div className="text-center py-20 text-2xl text-gray-500 font-semibold">Your cart is empty, macha! Go buy something.</div>;
  }

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-gray-500">Qty: {item.qty}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-lg">₹{item.price * item.qty}</span>
              <button onClick={() => handleRemove(item)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 text-right">
          <h2 className="text-2xl font-extrabold text-gray-800">Total: ₹{total}</h2>
          <button className="mt-4 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}