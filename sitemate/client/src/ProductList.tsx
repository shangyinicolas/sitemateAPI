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
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:5000/api/products"
      );
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
    // Check if fields are empty
    if (!newProduct.title || !newProduct.description) {
      setIsFieldEmpty(true);
      return;
    }
    try {
      const response = await axios.post<Product>(
        "http://localhost:5000/api/products",
        newProduct
      );
      setNewProduct({ id: 0, title: "", description: "" });
      setProducts([...products, response.data]);
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
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="my-5">Product List</h1>
      <ul className="list-group">
        {products.map((product) => (
          <li className="list-group-item" key={product.id}>
            {editProduct === product ? (
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Product
                </button>
              </form>
            ) : (
              <>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={newProduct.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
          />
        </div>
        {/* Display error message */}
        {isFieldEmpty && (
          <p className="text-danger">Both fields are required.</p>
        )}
        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductList;
