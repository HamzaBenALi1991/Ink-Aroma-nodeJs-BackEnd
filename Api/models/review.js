const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = mongoose.Schema(
  {
    user: { type : mongoose.Schema.Types.ObjectId , ref :"Users" , required : true , },
    book : { type : mongoose.Schema.Types.ObjectId , ref :"Book" , required : true },
    review: String,
    BookScore: {type : Number , required :true  , default :0},
    upvotes : { type : Number , default : 0 }, 
    downvotes : { type : Number , default : 0 }
  },
  { versionKey: false, timestamps: true }
);

// create the user model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
