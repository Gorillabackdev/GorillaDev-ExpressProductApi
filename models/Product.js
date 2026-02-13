const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    ImageUrl: {
      type: String,
      default: null
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
