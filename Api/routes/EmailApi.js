const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// wrap async function
router.post("/", async (req, res) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user, 
        pass: process.env.password , // 
      },
    });

    // send mail with text
    const mailtext = await transporter.sendMail({
      from: '" Hatem" <testforhamza@gmail.com>', // sender address
      to: "hatem.dagbouj@fivepoints.fr", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello SHinigami again ", // plain text body
      html: "<h1> Hello Shinigami  </h1>", // html body
      
    });
    res.json({message : " mail sent successfully ."} )
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});
module.exports=router ; 
