import React, { useEffect, useState } from "react";
import { useProductStore, Product } from "../../app/productStore";
import axios from "axios";
import { Button, Modal, Input, Space } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products: React.FC = () => {
  const { loading, products, error, fetchProducts } = useProductStore();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    image: "",
    price: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (): Promise<void> => {
    try {
      await axios.post<Product>("http://localhost:3000/products", newProduct);
      toast.success("Product added successfully!");
      await fetchProducts(); // Mahsulotlar ro'yxatini yangilash
      setModalVisible(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to add product: ${error.message}`);
      } else {
        toast.error("Failed to add product");
      }
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!currentProduct) return;
    try {
      await axios.put<Product>(
        `http://localhost:3000/products/${currentProduct.id}`,
        currentProduct
      );
      toast.success("Product updated successfully!");
      await fetchProducts(); // Mahsulotlar ro'yxatini yangilash
      setModalVisible(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to update product: ${error.message}`);
      } else {
        toast.error("Failed to update product");
      }
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      toast.success("Product deleted successfully!");
      await fetchProducts(); // Mahsulotlar ro'yxatini yangilash
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to delete product: ${error.message}`);
      } else {
        toast.error("Failed to delete product");
      }
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setNewProduct({
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
      });
      setIsEditing(true);
    } else {
      setCurrentProduct(null);
      setNewProduct({ title: "", description: "", image: "", price: 0 });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin border-4 border-t-4 border-blue-500 rounded-full w-8 h-8"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-lg text-center">{error}</p>}
      <Button onClick={() => openModal()} type="primary" className="mb-4">
        Add New Product
      </Button>
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-auto">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
              <img
                src={product.image}
                alt={product.title}
                className="w-40 h-40 object-cover p-5"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">
                  {product.description}
                </p>
                <p className="text-lg font-semibold">${product.price}</p>
                <Space className="mt-4">
                  <Button onClick={() => openModal(product)} type="primary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(product.id)} danger>
                    Delete
                  </Button>
                </Space>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && <p className="text-center text-lg">No products found</p>
      )}
      <Modal
        title={isEditing ? "Edit Product" : "Add New Product"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={isEditing ? handleUpdate : handleCreate}>
        <Input
          placeholder="Title"
          value={newProduct.title}
          onChange={e =>
            setNewProduct({ ...newProduct, title: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Description"
          value={newProduct.description}
          onChange={e =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="mb-2"
        />
        <Input
          placeholder="Image URL"
          value={newProduct.image}
          onChange={e =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
          className="mb-2"
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={e =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          className="mb-2"
        />
      </Modal>
    </div>
  );
};

export default Products;
