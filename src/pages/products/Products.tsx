import React, { useEffect } from "react";
import { useProductStore } from "../../app/productStore";

// Product interface (defines the structure of each product)
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

// Define the type for the `useProductStore` return object
interface ProductStore {
  loading: boolean;
  products: Product[];
  error: string | null;
  fetchProducts: () => void;
}

const Products: React.FC = () => {
  const productStore: ProductStore = useProductStore();
  const { loading, products, error, fetchProducts } = productStore;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin border-4 border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg text-center">
          {error || "An error occurred"}
        </p>
      ) : products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-auto">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between">
              <img
                src={product.image}
                alt={product.title}
                className="w-full object-fit p-5"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">
                  {product.description}
                </p>
                <p className="text-lg font-semibold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">No products found</p>
      )}
    </div>
  );
};

export default Products;
