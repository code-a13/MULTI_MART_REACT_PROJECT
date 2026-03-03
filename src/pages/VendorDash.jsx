import { useState } from "react";
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Trash2, X } from "lucide-react";

export default function VendorDash() {
  // Functional State Management
  const [inventory, setInventory] = useState([
    { id: 1, name: "Premium Leather Jacket", stock: 45, price: 120, status: "In Stock" },
    { id: 2, name: "Wireless Earbuds", stock: 5, price: 45, status: "Low Stock" },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });

  // Dynamic Statistics
  const totalRevenue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const activeProducts = inventory.length;

  const handleAddProduct = (e) => {
    e.preventDefault();
    const stockNum = parseInt(newProduct.stock);
    const productEntry = {
      id: Date.now(), // Generate fake ID
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: stockNum,
      status: stockNum > 10 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock"
    };
    
    // Spread operator to add new item to existing array
    setInventory([...inventory, productEntry]);
    setNewProduct({ name: "", price: "", stock: "" }); // Reset form
    setShowForm(false); // Hide form
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color} text-white`}><Icon size={28} /></div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Vendor Administration</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
        >
          {showForm ? <X size={20}/> : <Plus size={20}/>} 
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Potential Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Active Listings" value={activeProducts} icon={Package} color="bg-blue-500" />
        <StatCard title="Pending Orders" value="12" icon={ShoppingCart} color="bg-orange-500" />
        <StatCard title="Store Rating" value="4.8/5" icon={TrendingUp} color="bg-purple-500" />
      </div>

      {/* Conditional Rendering: Add Product Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Listing</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Smart Watch" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" required min="1" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="99.99" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
              <input type="number" required min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="50" />
            </div>
            <div className="md:col-span-4 mt-2">
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">Save to Inventory</button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Product Details</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-600">${item.price}</td>
                  <td className="p-4 text-gray-600">{item.stock} units</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' : item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Inventory is empty. Add a product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}