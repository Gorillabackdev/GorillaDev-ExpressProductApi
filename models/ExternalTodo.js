const mongoose = require("mongoose");

const externalTodoSchema = new mongoose.Schema(
  {
    externalId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      required: true
    },
    sourceUrl: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model("ExternalTodo", externalTodoSchema);
