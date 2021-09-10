const express = require("express");
const { now } = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

const Book = require("../models/bookSchema");

// get all Books request  :
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({
      books: books,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// get Book by Id
router.get("/book/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (book) {
      // checking if the Id is valid
      res.json({
        book: book,
      });
    } else {
      // response if the Id is not valid
      res.status(404).json({
        message: "there is no Book with this ID",
      });
    }
  } catch (error) {
    // catch block for different kind of error
    res.status(500).json({
      message: error.message,
    });
  }
});
// create a new Book
router.post("/newbook", upload.single("bookCover"), async (req, res) => {
  try {
    if (req.file) {
      const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        reviews: req.body.reviews,
        bookScore: req.body.bookScore,
        bookCover: req.file.path,
      });
      res.status(200).json({
        book: book,
      });
    } else {
      // multer does not allow no file req operation in case the user did not choose a picture
      const book = await Book.create({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        reviews: req.body.reviews,
        bookScore: req.body.bookScore,
      });
      res.status(200).json({
        book: book,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// update book
router.put("/book/:id", upload.single("bookCover"), async (req, res) => {
  try {
    const oldbook = await Book.findById(req.params.id);

    if (oldbook && req.file) {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          reviews: req.body.reviews,
          bookScore: req.body.bookScore,
          bookCover: req.file.path,
        },
        {
          new: true,
        }
      );
      try {
        // this is for removing old image after updating book image
        fs.unlinkSync(oldbook.bookCover);
        //file removed
      } catch (err) {
        console.error(err);
      }
      // checking if the book already exist or not
      res.json({
        message: "book has been updated .",
        newBookInfos: book,
      });
    } else if (oldbook && req.file == undefined) {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          reviews: req.body.reviews,
          bookScore: req.body.bookScore,
        },
        {
          new: true,
        }
      );
      res.json({
        message: "book has been updated .",
        newBookInfos: book,
      });
    } else {
      res.status(404).json({
        message:
          " there is no book with this ID to update .please check ID again .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// delete book by Id
router.delete("/book/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (book) {
      res.json({ message: "Book been deleted successfully" });
    } else {
      res.status(404).json({
        message: "there is no book with this ID so you can delete it .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// affect a review
router.put("/affect-review/:idbook/:idreview", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.idbook,
      { $push: { reviews: req.params.idreview } },
      {
        new: true,
      }
    );
    res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// remove review
router.put("/desaffect-review/:idbook/:idreview", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.idbook,
      { $pull: { reviews: req.params.idreview } },
      {
        new: true,
      }
    );
    res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;
