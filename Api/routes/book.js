const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const passport = require("passport");
// import book controllers
const bookControllers = require("../../controllers/bookcontrollers");
// multer configuration
const my_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // where images will be stored
    cb(null, "./uploads/books/");
  },

  filename: (req, file, cb) => {
    // under what name will the image be saved
    const file_extention = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + file_extention;
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
  limits: {
    // taille max image
    fileSize: 1024*1024,
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




// get all Books request  :
router.get(
  "/books",
  passport.authenticate("bearer", { session: false }),
  bookControllers.getall
);
// get Book by Id
router.get(
  "/book/:id",
  passport.authenticate("bearer", { session: false }),
  bookControllers.getOnebyId
);
// create a new Book AND  affecting the book to the user AddedBooks
router.post(
  "/newbook",
  [
    passport.authenticate("bearer", { session: false }),
    upload.single("bookCover"),
  ],
  bookControllers.createBook
);
// update book
router.put(
  "/book/:id",
  [
    passport.authenticate("bearer", { session: false }),
    upload.single("bookCover"),
  ],
  bookControllers.update
);
// delete book by Id plus removing from user added books
router.delete(
  "/book/:id",
  passport.authenticate("bearer", { session: false }),
  bookControllers.delete
);
// affect a review
router.put(
  "/affect-review/:idbook/:idreview",
  passport.authenticate("bearer", { session: false }),
  bookControllers.affectReview
);
// remove review
router.put(
  "/desaffect-review/:idbook/:idreview",
  passport.authenticate("bearer", { session: false }),
  bookControllers.desaffectReview
);

module.exports = router;
