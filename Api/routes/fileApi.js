const express =require('express') ; 
const router = express.Router();
const uploads =require('../../controllers/imagecontroller')

// multer needed packages
const multer = require("multer");
const path = require("path");

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

  router.post('/upload/:id' ,upload.single("file") ,uploads.upload);
  
  module.exports = router;

  
