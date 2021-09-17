const passport = require("passport");
const jwt = require("jsonwebtoken");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../Api/models/userschema");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const { json } = require("body-parser");

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decoded = jwt.verify(token, "hamza");
      const user = await User.findById(decoded.Id);
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user, { scope: "all" });
      }
    } catch (error) {
        console.log(error);
        return done(null, false);

    
    }
  })
);

 