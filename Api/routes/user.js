const express = require("express");
const router = express.Router();

// import User controllers
const UserControllers = require("../../controllers/userControllers");

// passport
const passport = require("passport");
// multer needed packages
const multer = require("multer");
const path = require("path");
const { Router } = require('express');

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
      cb(null, file.originalname + "-" + uniqueSuffix);
    },
    limits: {
      // taille max image
      fileSize: 200000000,
    },
  });
  
  // file filter function
  const fileFilterFunction = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
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
router.post("/newuser", upload.single("image") ,  UserControllers.createuser2);

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

router.put("/changepassword/:id" , UserControllers.editpassword)

module.exports = router;
