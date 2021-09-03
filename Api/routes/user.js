const express = require("express");
const router = express.Router();
// importing User schema 
const User = require("../models/userschema");

// get all users request  :
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// get user by Id
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favoritbooks reviews');
    if (user) { // checking if the Id is valid 
      res.json({
        user: user,
        url: "http://localhost:3000/users/" + user._id,
      });
    } else { // response if the Id is not valid 
      res.status(404).json({
        message: "there is no user with this ID",
      });
    }
  } catch (error) { // catch block for different kind of error 
      res.status(500).json({
          message : error.message 
      })
  }
});

// create a users
router.post("/newuser", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// update user 
router.put("/user/:id",async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (user) { // checking if the user already exist or not 
        res.json({
          message: "user has been updated .",
          newUserInfos: user,
        });
      } else {
        res.status(404).json({
          message:
            " there is no user with this ID to update .please check ID again .",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  });
// delete user by Id
router.delete("/user/:id" , async (req, res) => {
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
  });

// affect a favour book 
router.put("/affect-book/:iduser/:idbook", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.iduser,
      { $push: { favoritbooks: req.params.idbook } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// desafecte todo from user
router.put("/desaffect-book/:iduser/:idbook", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.iduser,
      { $pull: { favoritbooks: req.params.idbook } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});   
// affect a review 
router.put("/affect-reviewtouser/:iduser/:idreview", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.iduser,
      { $push: { reviews: req.params.idreview } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
// remove review 
router.put("/desaffect-reviewtouser/:iduser/:idreview", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.iduser,
      { $pull: { reviews: req.params.idreview } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});  
// added book api 
router.put("/user/newbook/:iduser/:idbook", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.iduser,
      { $push: { addedbooks: req.params.idbook } },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});




module.exports = router;
