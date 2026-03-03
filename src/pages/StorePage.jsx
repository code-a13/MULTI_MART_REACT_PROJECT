import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function StorePage() {
  const { id } = useParams(); // Gets the store ID from the URL

  // Mock data - later we fetch based on 'id'
  const products = [
    { id: 101, storeId: 1, name: "iPhone 15 Pro", price: 120000, image: "https://via.placeholder.com/300" },
    { id: 102, storeId: 1, name: "MacBook Air", price: 95000, image: "https://via.placeholder.com/300" },
  ];

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Store ID: {id}</h1>
      <p className="text-gray-500 mb-8">Showing products for this vendor...</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}