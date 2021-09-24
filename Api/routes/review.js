const express = require("express");
const router = express.Router();
const Reviews = require("../models/review");
const passport = require("passport");
const User = require("../models/userschema");

// get all reviews
router.get(
  "/reviews",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const reviews = await Reviews.find({}).populate("user book");
      console.log();
      res.status(200).json({
        reviews: reviews,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  }
);
// create a new review + adding the review Id to the user reviews
router.post(
  "/newreview",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const review = await Reviews.create(req.body);
      //adding the review Id to the user reviews
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { reviews: review.id } },
        {
          new: true,
        }
      );
      res.status(200).json({
        review: review,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// update review
router.put(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
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
  }
);
// delete review by Id
router.delete(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const review = await Reviews.findByIdAndRemove(req.params.id);
      if (review) {
        await User.findByIdAndUpdate(
          req.user.id,
          { $pull: { reviews: review.id } },
          {
            new: true,
          }
        );
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
  }
);
router.get(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const review = await Reviews.findById(req.params.id).populate(
        "user book"
      );
      if (review) {
        // checking if the Id is valid
        res.json({
          review: review,
        });
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
  }
);

module.exports = router;
