const fs = require("fs");
const User = require("../Api/models/userschema");
const Book = require("../Api/models/bookSchema");
const Review = require("../Api/models/review");

// get all book controller
exports.getall = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// get book by Id controller
exports.getOnebyId = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (book) {
      // checking if the Id is valid
      res.json(book);
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
};
// update book controller
exports.update = async (req, res) => {
  try {
    const oldbook = await Book.findById(req.params.id);

    if (oldbook) {
      const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json({
        message: "book has been updated .",
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
};
// delete book controller
exports.delete = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      // remove book from user added book
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { addedbooks: book._id } },
        {
          new: true,
        }
      );
      const reviewsId = [];
      //remove all books reviews and delete these review.id from user.review
      if (book.reviews.length > 0) {
        for (let i = 0; i < book.reviews.length; i++) {
          reviewsId.push(book.reviews[i]);
        }
        for (let j = 0; j < reviewsId.length; j++) {
          const review = await Review.findById(reviewsId[j]);
          // remove user.Reviews from book.Reviews
          await User.findByIdAndUpdate(
            review.user,
            { $pull: { reviews: reviewsId[j] } },
            {
              new: true,
            }
          );
          await Review.findByIdAndRemove(reviewsId[j]);
        }
      }
      if (
        book.bookCover != "http://localhost:3000/uploads/users/download.jpeg"  ) {
        fs.unlinkSync("uploads/books/" + book.bookCover);
      }

      await Book.findByIdAndRemove(req.params.id);
      res.json({ message: "Book has been been deleted successfully" });
    } else {
      res.status(404).json({
        message: "there is no book with this ID so you can delete it .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// creating new book
exports.createBook = async (req, res) => {
  try {
    let { book } = req.body;
    book = JSON.parse(JSON.parse(JSON.stringify(book)));
    const exist = await Book.find({ title: book.title });
    if (exist.length > 0) {
      if (req.file) {
        // this feild reserved for later for removing image already saved
        const imagePath = req.file.filename; // Note: set path dynamically
        fs.unlinkSync("uploads/books/" + imagePath);

        // in case find return nothing its not null ot empty array
        res.status(409).json("This Book  already exist");
      } else {
        res.status(409).json("This Book  already exist");
      }
    } else {
      if (req.file) {
        const imagePath = req.file.filename;
        book.bookCover = imagePath;
        const createdBook = await Book.create(book);
        await User.findByIdAndUpdate(
          req.user.id,
          { $push: { addedbooks: createdBook._id } },
          {
            new: true,
          }
        );
        res.status(201).json(createdBook);
      } else {
        const imagePath = "http://localhost:3000/uploads/books/generic.jpg"; // Note: set path dynamically
        book.bookCover = imagePath;
        const createdBook = await Book.create(book);
        res.status(201).json(createdBook);
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// affect review to book controller
// not needed anymore this is for clean up
exports.affectReview = async (req, res) => {
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
};
// desaffect review from book controller
exports.desaffectReview = async (req, res) => {
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
};
