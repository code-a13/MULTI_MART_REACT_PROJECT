import { useState, useEffect, useContext } from "react";
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Trash2, X, LogOut, Image as ImageIcon, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function VendorDash() {
  const { user, login, logout } = useContext(AuthContext);
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("vendorInventory");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Premium Leather Jacket", stock: 45, price: 1200, category: "men's clothing", status: "In Stock", image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?w=200" },
      { id: 2, name: "Mini Flashlight (Mega Sale)", stock: 500, price: 2, category: "electronics", status: "In Stock", image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?w=200" }, // The ₹2 Product!
    ];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", image: "", category: "electronics" });

  useEffect(() => {
    localStorage.setItem("vendorInventory", JSON.stringify(inventory));
  }, [inventory]);

  const totalRevenue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const activeProducts = inventory.length;

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === "vendor@megamall.com" && loginForm.password === "admin123") {
      login({ name: "MegaMall Vendor", role: "vendor", email: loginForm.email });
      toast.success("Welcome back to your dashboard!");
    } else {
      toast.error("Invalid credentials. Use vendor@megamall.com / admin123");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const stockNum = parseInt(newProduct.stock);
    const productEntry = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: stockNum,
      category: newProduct.category,
      image: newProduct.image || "https://via.placeholder.com/150?text=No+Image", 
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock"
    };
    
    setInventory([productEntry, ...inventory]); 
    setNewProduct({ name: "", price: "", stock: "", image: "", category: "electronics" }); 
    setShowForm(false);
    toast.success(`${newProduct.name} published successfully!`);
  };

  const handleDelete = (id) => {
    const itemToDelete = inventory.find(item => item.id === id);
    setInventory(inventory.filter(item => item.id !== id));
    toast.info(`${itemToDelete?.name} removed.`);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all">
      <div className={`p-4 rounded-xl ${color} text-white shadow-inner`}><Icon size={24} /></div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
      </div>
    </motion.div>
  );

  // VIEW 1: LOGIN GATE
  if (!user || user.role !== "vendor") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Vendor Portal</h1>
          <p className="text-gray-500 text-sm mb-8">Secure login for MegaMall merchants.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="vendor@megamall.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="admin123" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md mt-4">
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // VIEW 2: VENDOR DASHBOARD
  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Vendor Administration</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
            {showForm ? <X size={18}/> : <Plus size={18}/>} 
            {showForm ? "Cancel" : "Upload Product"}
          </button>
          <button onClick={() => { logout(); toast.info("Logged out successfully."); }} className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2">
            <LogOut size={18}/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* CHANGED DOLLAR TO RUPEE HERE */}
        <StatCard title="Potential Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Active Listings" value={activeProducts} icon={Package} color="bg-blue-500" />
        <StatCard title="Pending Orders" value="12" icon={ShoppingCart} color="bg-orange-500" />
        <StatCard title="Store Rating" value="4.8/5" icon={TrendingUp} color="bg-purple-500" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 mb-8">
          <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="text-blue-600"/> Upload New Product
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            <div className="md:col-span-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Smart Watch" />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none capitalize cursor-pointer">
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
              </select>
            </div>

            <div className="md:col-span-3">
              {/* CHANGED DOLLAR TO RUPEE HERE */}
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input type="number" step="0.01" required min="1" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="99.99" />
            </div>

            <div className="md:col-span-8">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><ImageIcon size={14}/> Image URL</label>
              <input type="url" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="https://images.pexels.com/..." />
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Qty</label>
              <input type="number" required min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="50" />
            </div>

            <div className="md:col-span-12 flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-dashed border-blue-200 mt-2">
              <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {newProduct.image ? (
                  <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src="https://via.placeholder.com/150?text=Invalid+Link"} />
                ) : (
                  <ImageIcon className="text-gray-300" size={24} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Live Image Preview</p>
                <p className="text-xs text-gray-500">Paste a valid URL to see your product image here before publishing.</p>
              </div>
              <button type="submit" className="ml-auto bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md">
                Publish
              </button>
            </div>

          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Live Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest bg-white">
                <th className="p-5 font-bold">Product</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold">Stock</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img" }}/>
                      </div>
                      <span className="font-bold text-gray-800 line-clamp-1">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-gray-500 capitalize text-sm">{item.category}</td>
                  {/* CHANGED DOLLAR TO RUPEE HERE */}
                  <td className="p-5 font-bold text-gray-800">₹{parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-5 font-medium text-gray-600">{item.stock}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl active:scale-90 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-medium">Inventory is empty. Upload a product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}