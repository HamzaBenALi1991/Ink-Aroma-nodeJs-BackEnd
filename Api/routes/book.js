const express = require("express");
const router = express.Router();

const Book =require('../models/bookSchema')

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
    const book = await Book.findById(req.params.id);
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
router.post("/newbook", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(200).json({
      book: book,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// update book
router.put("/book/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (book) {
      // checking if the book already exist or not
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

module.exports = router;
