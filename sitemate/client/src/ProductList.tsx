// src/ProductList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    title: "",
    description: "",
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get<Product[]>("/api/products");
  //     console.log("Response data:", response.data);
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };
  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:5000/api/products"
      );
      console.log("Response data:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Product>(
        "http://localhost:5000/api/products",
        newProduct
      );
      setProducts([...products, response.data]);
      setNewProduct({ id: 0, title: "", description: "" });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setNewProduct(product);
  };

  const handleUpdate = async () => {
    if (!editProduct) return;
    try {
      const response = await axios.put<Product>(
        `http://localhost:5000/api/products/${editProduct.id}`,
        newProduct
      );
      setProducts(
        products.map((p) => (p.id === editProduct.id ? response.data : p))
      );
      setEditProduct(null);
      setNewProduct({ id: 0, title: "", description: "" });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {editProduct === product ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
                <button type="submit">Update Product</button>
              </form>
            ) : (
              <>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newProduct.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductList;
