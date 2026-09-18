import { useEffect, useState } from "react";

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
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#15161b",
        color: "#aeb5c5",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          width: "75%",
          minHeight: "100vh",
          margin: "0 auto",
          borderLeft: "1px solid #292c34",
          borderRight: "1px solid #292c34",
          padding: "0 0 50px 0",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "52px",
            color: "#f1f1f1",
            margin: "5px 0 18px 0",
            fontWeight: "700",
            letterSpacing: "-1px",
          }}
        >
          Product Management System
        </h1>

        {/* Add Product */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0px",
            paddingBottom: "9px",
            borderBottom: "2px solid #aeb0b5",
          }}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "180px",
              height: "23px",
              padding: "0 5px",
              backgroundColor: "#3b3b3d",
              border: "1px solid #777",
              color: "#eee",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "170px",
              height: "23px",
              padding: "0 5px",
              backgroundColor: "#3b3b3d",
              border: "1px solid #777",
              color: "#eee",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "150px",
              height: "23px",
              padding: "0 5px",
              backgroundColor: "#3b3b3d",
              border: "1px solid #777",
              color: "#eee",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            onClick={addProduct}
            style={{
              height: "24px",
              padding: "0 10px",
              backgroundColor: "#777",
              color: "#fff",
              border: "1px solid #999",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Add Product
          </button>
        </div>

        {/* Product Table */}
        <table
          style={{
            borderCollapse: "collapse",
            marginTop: "10px",
            marginLeft: "0px",
            fontSize: "18px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "45px",
                  height: "50px",
                  border: "1px solid #7d8491",
                  color: "#aeb5c5",
                  textAlign: "center",
                }}
              >
                ID
              </th>

              <th
                style={{
                  width: "205px",
                  border: "1px solid #7d8491",
                  color: "#aeb5c5",
                  textAlign: "center",
                }}
              >
                Name
              </th>

              <th
                style={{
                  width: "100px",
                  border: "1px solid #7d8491",
                  color: "#aeb5c5",
                  textAlign: "center",
                }}
              >
                Price
              </th>

              <th
                style={{
                  width: "140px",
                  border: "1px solid #7d8491",
                  color: "#aeb5c5",
                  textAlign: "center",
                }}
              >
                Category
              </th>

              <th
                style={{
                  width: "80px",
                  border: "1px solid #7d8491",
                  color: "#aeb5c5",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td
                  style={{
                    height: "48px",
                    border: "1px solid #7d8491",
                    textAlign: "center",
                  }}
                >
                  {product.id}
                </td>

                <td
                  style={{
                    border: "1px solid #7d8491",
                    textAlign: "center",
                    padding: "0 8px",
                  }}
                >
                  {product.name}
                </td>

                <td
                  style={{
                    border: "1px solid #7d8491",
                    textAlign: "center",
                  }}
                >
                  ₹{product.price}
                </td>

                <td
                  style={{
                    border: "1px solid #7d8491",
                    textAlign: "center",
                  }}
                >
                  {product.category}
                </td>

                <td
                  style={{
                    border: "1px solid #7d8491",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      backgroundColor: "#777",
                      color: "white",
                      border: "1px solid #999",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p
            style={{
              marginLeft: "10px",
              color: "#888",
            }}
          >
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;