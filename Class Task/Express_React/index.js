import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 5000;
const FILE = "./product.json";

app.use(cors());
app.use(express.json());

// Read products
function getProducts() {
  const data = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(data);
}

// Save products
function saveProducts(products) {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
}

// GET all products
app.get("/api/products", (req, res) => {
  try {
    const products = getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error reading products" });
  }
});

// GET product by ID
app.get("/api/products/:id", (req, res) => {
  try {
    const products = getProducts();
    const id = parseInt(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error reading product" });
  }
});

// POST - Add product
app.post("/api/products", (req, res) => {
  try {
    const products = getProducts();

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const newProduct = {
      id: products.length > 0
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1,
      name,
      price,
      category,
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// PUT - Update complete product
app.put("/api/products/:id", (req, res) => {
  try {
    const products = getProducts();
    const id = parseInt(req.params.id);

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    products[index] = {
      id,
      name,
      price,
      category,
    };

    saveProducts(products);

    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// PATCH - Update selected fields
app.patch("/api/products/:id", (req, res) => {
  try {
    const products = getProducts();
    const id = parseInt(req.params.id);

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category } = req.body;

    products[index] = {
      ...products[index],
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category }),
    };

    saveProducts(products);

    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE - Delete product
app.delete("/api/products/:id", (req, res) => {
  try {
    const products = getProducts();
    const id = parseInt(req.params.id);

    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products.splice(index, 1)[0];

    saveProducts(products);

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});