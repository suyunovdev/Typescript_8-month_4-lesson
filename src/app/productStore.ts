import axios from "axios";
import { create } from "zustand";

// Define the structure of the product data
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string; // This should match the field name used in your API response
}

interface ProductStore {
  loading: boolean;
  products: Product[];
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>(set => ({
  loading: false,
  products: [],
  error: null,
  fetchProducts: async () => {
    set(() => ({
      loading: true,
    }));
    try {
      const res = await axios.get<Product[]>("http://localhost:3000/products");
      set(() => ({
        loading: false,
        products: res.data,
        error: null,
      }));
    } catch (err: unknown) {
      set(() => ({
        loading: false,
        products: [],
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  },
}));
