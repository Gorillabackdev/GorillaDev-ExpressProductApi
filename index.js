require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const axios = require("axios");
const { v2: cloudinary } = require("cloudinary");
const Product = require("./models/Product");
const ExternalTodo = require("./models/ExternalTodo");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "product_app";
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

function mapExternalTodoResponse(apiResponse, sourceUrl) {
  return {
    externalId: apiResponse.id,
    userId: apiResponse.userId,
    title: apiResponse.title,
    completed: apiResponse.completed,
    sourceUrl
  };
}

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/products", upload.single("image"), async (req, res) => {
  const price = Number(req.body.price);

  if (!req.body.name || Number.isNaN(price)) {
    return res.status(400).json({ message: "Name (string) and price (number) are required" });
  }

  try {
    let imageUrl = req.body.ImageUrl || null;

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url || uploadResult.url || null;
    }

    const product = await Product.create({
      id: Date.now(),
      name: req.body.name,
      price,
      description: req.body.description || null,
      ImageUrl: imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
});

app.get("/external/todos/1", async (req, res) => {
  const sourceUrl = "https://jsonplaceholder.typicode.com/todos/1";

  try {
    const externalResponse = await axios.get(sourceUrl);
    const mappedTodo = mapExternalTodoResponse(externalResponse.data, sourceUrl);
    const savedTodo = await ExternalTodo.create(mappedTodo);
    res.status(200).json(savedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch and persist external todo",
      error: error.message
    });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id, ...updateData } = req.body;

  if (updateData.price !== undefined) {
    const parsedPrice = Number(updateData.price);
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: "price must be a number" });
    }
    updateData.price = parsedPrice;
  }

  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: Number(req.params.id) });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
