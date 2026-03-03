import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../services/api";
import { Loader } from "lucide-react";

export default function StorePage() {
  const { id } = useParams(); // Gets the dynamic category from URL (e.g., 'electronics')
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Always set loading to true when starting a new fetch
      try {
        // Fetch products strictly for the selected category
        const response = await api.get(`/products/category/${id}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [id]); // This dependency is CRUCIAL! Re-run if the URL changes.

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{id} Store</h1>
      <p className="text-gray-500 mb-8">Showing premium products from this vendor...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            // FakeStoreAPI returns 'title', but our ProductCard expects 'name'. 
            // We map it cleanly here so we don't break the existing component!
            product={{ 
              ...product, 
              name: product.title, 
              storeName: id 
            }} 
          />
        ))}
      </div>
    </div>
  );
}