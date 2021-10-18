const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    bookCover: {type : String , required :false },
    description: {type : String , required :true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    BookScore: {type : Number , required :false , default : -1 },
    categorie : { type :String  , required : true },
    user : { type : mongoose.Schema.Types.ObjectId, ref : "Users"}
  },
  { versionKey: false, timestamps: true }
);

// create the user model
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
