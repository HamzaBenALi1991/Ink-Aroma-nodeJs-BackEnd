const Reviews = require("../Api/models/review");
const User = require("../Api/models/userschema");
const Book = require("../Api/models/bookSchema");

exports.getall = async (req, res) => {
  try {
    const reviews = await Reviews.find({}).populate("user book");
    console.log();
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// create a new review + adding the review Id to the user reviews array
exports.createRev = async (req, res) => {
  try {
    // create the review and saving it
    const review = await Reviews.create(req.body);
    //adding the review Id to the user.reviews
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { reviews: review.id } },
      {
        new: true,
      }
    );
    //adding review Id to book.reviews
    const book = await Book.findByIdAndUpdate(
      req.body.book,
      { $push: { reviews: review.id } },
      {
        new: true,
      }
    );
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// delete review by Id + removing from user reviews array
exports.delete = async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id);
    if (review) {
      //Remove review from user
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { reviews: review.id } },
        {
          new: true,
        }
      );
      // remove review from book reviews
      await Book.findByIdAndUpdate(
        review.book._id,
        { $pull: { reviews: review.id } },
        {
          new: true,
        }
      );
      await Reviews.findByIdAndRemove(req.params.id)

      res.json({ message: "Review been deleted successfully" });
    } else {
      res.status(404).json({
        message: "there is no review with this ID so you can delete it .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// update review controller
exports.update = async (req, res) => {
  try {
    const review = await Reviews.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (review) {
      // checking if the review already exist or not
      res.json({
        message: "review has been updated .",
        newReviewInfos: review,
      });
    } else {
      res.status(404).json({
        message:
          " there is no review with this ID to update .please check ID again .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// get review by Id controller
exports.getRevbyId = async (req, res) => {
  try {
    const review = await Reviews.findById(req.params.id).populate("user");
    if (review) {
      // checking if the Id is valid
      res.json(review);
    } else {
      // response if the Id is not valid
      res.status(404).json({
        message: "there is no review with this ID",
      });
    }
  } catch (error) {
    // catch block for different kind of error
    res.status(500).json({
      message: error.message,
    });
  }
};
