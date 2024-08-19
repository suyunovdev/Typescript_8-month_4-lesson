import axios from "axios";
import { create } from "zustand";

// Mahsulotlar uchun interfeys (Product interface)
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string;
}

// Store interfeysi (ProductStore interface)
interface ProductStore {
  loading: boolean;
  products: Product[];
  error: string;
  fetchProducts: () => Promise<void>;
}

// ProductStore uchun Zustand store'ini yaratish
export const useProductStore = create<ProductStore>(set => ({
  loading: false,
  products: [],
  error: "",
  fetchProducts: async () => {
    set(state => ({
      ...state,
      loading: true,
    }));
    try {
      const res = await axios.get<Product[]>("http://localhost:3000/products");
      set(() => ({
        loading: false,
        products: res.data,
        error: "",
      }));
    } catch (err: unknown) {
      set(() => ({
        loading: false,
        products: [],
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  },
}));
