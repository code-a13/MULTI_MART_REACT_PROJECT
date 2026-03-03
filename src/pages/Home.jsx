import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export default function Home() {
  // Mock data for stores - later we will fetch this from API
  const stores = [
    { id: 1, name: "Apple Store", category: "Electronics" },
    { id: 2, name: "Nike Official", category: "Footwear" },
  ];

  return (
    <div className="py-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Explore MegaMall Stores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link to={`/stores/${store.id}`} key={store.id} className="block">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Store size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
                <p className="text-gray-500 text-sm">{store.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}