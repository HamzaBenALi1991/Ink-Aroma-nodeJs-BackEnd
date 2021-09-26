// jsonweb token
const jwt = require("jsonwebtoken");
// importing User schema
const User = require("../Api/models/userschema");

// needed for removing file after update
const fs = require("fs");
// for hashing password
const bcrypt = require("bcrypt");


// login controller 
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // check password if correct
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        const tokenData = {
          // add as many needed informations
          email: user.email,
          Psoeudo: user.pseudo,
          Age: user.age,
          Id: user._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        res.status(403).json({
          message: "Login Succeded . ",
          token: token,
        });
      } else {
        res.status(403).json({
          message: "Please make sure the email and password are correct .",
        });
      }
    } else {
      res.send({
        message: "Please make sure the email and password are correct .",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// register controller 
exports.register = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const exist = await User.find({ email: req.body.email });
    if (exist.length > 0) {
      // in case find return nothing its not null ot empty array
      res.status(409).json({
        message: "email already exist . ",
      });
    } else {
      if (req.file) {
        // checking if there is an image or not ,else multer will block it
        const user = await User.create({
          pseudo: req.body.pseudo,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          age: req.body.age,
          country: req.body.country,
          city: req.body.city,
          phone: req.body.phone,
          image: req.file.path,
          favoritbooks: req.body.favoritbooks,
          addedbooks: req.body.addedbooks,
          reviews: req.body.reviews,
        });
        res.status(200).json({
          user: user,
        });
      } else {
        const user = await User.create({
          pseudo: req.body.pseudo,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          age: req.body.age,
          country: req.body.country,
          city: req.body.city,
          phone: req.body.phone,
          favoritbooks: req.body.favoritbooks,
          addedbooks: req.body.addedbooks,
          reviews: req.body.reviews,
        });
        res.status(200).json({
          user: user,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// get all user controllers 
exports.getall =  async (req, res) => {
  try {

    const users = await User.find({});
    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// get user byId controler 
exports.getOneById =  async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "favoritbooks reviews"
    );
    if (user) {
      // checking if the Id is valid
      res.json({
        user: user,
        url: "http://localhost:3000/users/" + user._id,
      });
    } else {
      // response if the Id is not valid
      res.status(404).json({
        message: "there is no user with this ID",
      });
    }
  } catch (error) {
    // catch block for different kind of error
    res.status(500).json({
      message: error.message,
    });
  }
}; 
// delete user controler 
exports.delete = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      res.json({ message: "User been deleted successfully" });
    } else {
      res.status(404).json({
        message: "there is no user with this ID so you can delete it .",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

// update one byId controller 
exports.update =   async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const olduser = await User.findById(req.params.id);
    if (olduser && req.file) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          pseudo: req.body.pseudo,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          age: req.body.age,
          country: req.body.country,
          city: req.body.city,
          phone: req.body.phone,
          image: req.file.path,
          favoritbooks: req.body.favoritbooks,
          addedbooks: req.body.addedbooks,
          reviews: req.body.reviews,
        },
        {
          new: true,
        }
      );
      // this is for removing old image after updating
      try {
        fs.unlinkSync(olduser.image);
        //file removed
      } catch (err) {
        console.error(err);
      }
      res.json({
        message: "user has been updated .",
        newUserInfos: user,
      });
    } else if (olduser && req.file == undefined) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          pseudo: req.body.pseudo,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
          age: req.body.age,
          country: req.body.country,
          city: req.body.city,
          phone: req.body.phone,
          favoritbooks: req.body.favoritbooks,
          addedbooks: req.body.addedbooks,
          reviews: req.body.reviews,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        user: user,
      });
    } else {
      res.status(404).json({
        message:
          " there is no user with this ID to update .please check ID again .",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

// affect a favour book to a user using book Id conroller
exports.affectFavBook =  async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { favoritbooks: req.params.idbook } },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "book added successfully to Favorits . ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
// désaffact fav book from user controller 
exports.removeFavBook =  async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.iduser,
      { $pull: { favoritbooks: req.params.idbook } },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Book has been removed from you <3 list .  ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};


