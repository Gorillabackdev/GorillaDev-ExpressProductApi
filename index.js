const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
let products = [];

app.post("/products", (req, res) => {
  if (!req.body.name || typeof req.body.price !== 'number') {
    return res.status(400).json({ message: "Name (string) and price (number) are required" });
  }

  const product = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price
  };

  products.push(product);
  res.status(201).json(product);
});
app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.put("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Prevent ID from being updated by extracting it from body if present
  const { id, ...updateData } = req.body;

  products[index] = {
    ...products[index],
    ...updateData
  };

  res.json(products[index]);
});

app.delete("/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  res.status(204).send();
});
