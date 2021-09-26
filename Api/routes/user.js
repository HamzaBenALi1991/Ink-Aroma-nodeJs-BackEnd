const express = require("express");
const router = express.Router();

// import User controllers
const UserControllers = require("../../controllers/userControllers");
// multer needed packages
const multer = require("multer");
const path = require("path");

// passport
const passport = require("passport");

// multer configuration
const my_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // where images will be stored
    cb(null, "./uploads/users/");
  },

  filename: (req, file, cb) => {
    // under what name will the image be saved
    const file_extention = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + file_extention;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
  limits: {
    // taille max image
    fileSize: 1024 * 1024,
  },
});

// file filter function
const fileFilterFunction = (req, file, cb) => {
  const file_extention = path.extname(file.originalname);
  const allowedExtentions = [".jpg", ".jpeg", ".png", ".gif"];
  if (!allowedExtentions.includes(file_extention)) {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};
// 2.0 create upload
const upload = multer({ storage: my_storage, fileFilter: fileFilterFunction });

// get all users request  :
router.get(
  "/users",
  passport.authenticate("bearer", { session: false }),
  UserControllers.getall
);

// get user by Id
router.get(
  "/user/:id",
  passport.authenticate("bearer", { session: false }),
  UserControllers.getOneById
);

// create a user or Register
router.post("/newuser", upload.single("userImage"), UserControllers.register);

// update user
router.put(
  "/user/:id",
  [
    passport.authenticate("bearer", { session: false }),
    upload.single("userImage"),
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
