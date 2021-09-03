const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    bookCover: String,
    description: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    BookScore: Number,
  },
  { versionKey: false, timestamps: true }
);

// create the user model
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
