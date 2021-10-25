const express = require("express");
const router = express.Router();
const { Router } = require("express");
const Reset = require("../../controllers/forgetpasswordController");

router.put("/forgetEmail", Reset.resetlink);

router.put("/resetpassword" , Reset.resetpassword);

module.exports = router;
