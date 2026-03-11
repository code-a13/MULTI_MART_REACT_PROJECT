import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api"; 
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Extracts the 'q' parameter
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Fetch all stores (or products directly if your API supports it)
        const response = await api.get("/stores");
        
        // Combine all products from all stores into one massive array
        const allProducts = response.data.flatMap(store => store.products || []);
        
        // Filter the array based on the query (ignoring case)
        const filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(filteredProducts);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]); // Re-run effect if the user searches for something new

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Search Results for "{query}"
      </h1>
      
      {loading ? (
        <p>Loading your products...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
             // Reusing your existing ProductCard component!
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl text-gray-500">No products found matching your search.</h2>
        </div>
      )}
    </div>
  );
}