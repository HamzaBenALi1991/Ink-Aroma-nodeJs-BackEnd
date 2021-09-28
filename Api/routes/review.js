const express = require("express");
const router = express.Router();
const passport = require("passport");

const reviewControllers = require("../../controllers/reviewcontroller");

// get all reviews
router.get(
  "/reviews",
  passport.authenticate("bearer", { session: false }),
  reviewControllers.getall
);
// create a new review + adding the review Id to the user reviews array
router.post(
  "/newreview",
  passport.authenticate("bearer", { session: false }),
  reviewControllers.createRev
);

// update review
router.put(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  reviewControllers.update
);
// delete review by Id + removing from user reviews array
router.delete(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  reviewControllers.delete
);
// get review by id
router.get(
  "/review/:id",
  passport.authenticate("bearer", { session: false }),
  reviewControllers.getRevbyId
);

module.exports = router;
