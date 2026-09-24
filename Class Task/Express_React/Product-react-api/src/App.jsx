import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // GET products
  const getProducts = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.log("Error fetching products:", error));

    return () => {
      isMounted = false;
    };
  }, []);

  // POST product
  const addProduct = async () => {
    if (!name || !price || !category) {
      alert("Please enter product name, price and category");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: Number(price),
          category: category,
        }),
      });

      if (response.ok) {
        setName("");
        setPrice("");
        setCategory("");
        getProducts();
      }
    } catch (error) {
      console.log("Error adding product:", error);
    }
  };

  // DELETE product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        getProducts();
      }
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Product Management System</h1>

      {/* Add Product Form */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        />

        <button onClick={addProduct} className="btn-add">
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th>Name</th>
              <th style={{ width: "120px" }}>Price</th>
              <th style={{ width: "160px" }}>Category</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="product-id">#{product.id}</td>
                <td className="product-name">{product.name}</td>
                <td className="product-price">₹{product.price}</td>
                <td>
                  <span className="product-category">{product.category}</span>
                </td>
                <td>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p className="no-products">No products available.</p>
      )}
    </div>
  );
}

export default App;