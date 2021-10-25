const Book = require("../Api/models/bookSchema");
const fs =require('fs'); 
const User =require('../Api/models/userschema')

exports.upload = async (req, res) => {
  try {
    console.log(req.file);
    const file = await req.file;
    const olduser = await User.findById(req.params.id);
    if (!file) {
      res.status(400).json({
        message: "no file ",
      });
      console.log("no file .");
    }
    if (olduser && file) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          image: req.file.filename,
        },
        {
          new: true,
        }
      )
      fs.unlinkSync("uploads/users/" + olduser.image);

      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.upload2 =  async (req, res) => {
  try {
    const file = await req.file;
    const oldbook = await Book.findById(req.params.id);
    if (!file) {
      res.status(400).json({
        message: "no file ",
      });
      console.log("no file .");
    }
    if (oldbook && file) {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        {
          bookCover: req.file.filename,
        },
        {
          new: true,
        }
      )
      fs.unlinkSync("uploads/books/" + oldbook.bookCover);

      res.status(200).json(book);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

