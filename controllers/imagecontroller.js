const User = require("../Api/models/userschema");

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
          image: file.path
        },
        {
          new: true,
        }
      
      );res.status(200).json(user)
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
