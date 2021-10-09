const express = require("express");
const router = express.Router();

// import User controllers
const UserControllers = require("../../controllers/userControllers");

// passport
const passport = require("passport");



// get all users request  :
router.get(
  "/users",
  // passport.authenticate("bearer", { session: false }),
  UserControllers.getall
);

// get user by Id
router.get(
  "/user/:id",
  // passport.authenticate("bearer", { session: false }),
  UserControllers.getOneById
);

// create a user or Register
router.post("/newuser",  UserControllers.register);

// update user
router.put(
  "/user/:id",
  [
    passport.authenticate("bearer", { session: false }),
  ],
  UserControllers.update
);
// delete user by Id
router.delete(
  "/user/:id",
  passport.authenticate("bearer", { session: false }),
  UserControllers.delete
);

// affect a favour book to a user using book Id
router.put(
  "/affect-book/:idbook",
  passport.authenticate("bearer", { session: false }),
  UserControllers.affectFavBook
);

// desafecte a favriout book from a user using bookId
router.put(
  "/desaffect-book/:idbook",
  passport.authenticate("bearer", { session: false }),
  UserControllers.removeFavBook
);

// login
router.post("/login", UserControllers.login);

module.exports = router;
