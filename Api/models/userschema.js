// needed packages Import
const mongoose = require("mongoose");
const { Schema } = mongoose;

// user schema

const userSchema = new Schema(
  {
    pseudo: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    },
    password: { type: String, required: true, minlength: 6 },
    age: Number,
    country: String,
    city: String,
    phone: Number,
    image: String,
    favoritbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    addedbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    image : String

  },
  { versionKey: false, timestamps: true }
);
// create the user model
const User = mongoose.model("Users", userSchema);

module.exports = User;
