const mongoose = require("mongoose");

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// Create Category model from schema
const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
