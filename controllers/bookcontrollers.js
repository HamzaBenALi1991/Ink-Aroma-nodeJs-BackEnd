const fs = require("fs");
const User = require("../Api/models/userschema");
const Book = require("../Api/models/bookSchema");

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
          categorie: req.body.categorie,
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
          categorie: req.body.categorie,
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
};
// delete book controller
exports.delete = async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (book) {
      // remove book from user added book
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { addedbooks: book._id } },
        {
          new: true,
        }
      );
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
        fs.unlinkSync("uploads/books/" +imagePath);
        

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
