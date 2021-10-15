const User = require("../Api/models/userschema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

exports.upload = async (req, res) => {
  try {
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
          image: file.path,
        },
        {
          new: true,
        }
      );
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await req.body.image;
    console.log(req.body.image);
    const full =path.resolve( __dirname ,"../",image );
    res.download(full);
  } catch (error) {
    res.status(404).json({
      error :error.message
    })
  }
};

exports.try =async (req, res) => {
  const imageName = "uploads/users/file-1634134726425.jpg"
  const imagePath =path.resolve( __dirname ,"../",imageName );


  fs.exists(imagePath, exists => {
      if (exists) res.sendFile(imagePath);
      else res.status(400).send('Error: Image does not exists');
  });
}