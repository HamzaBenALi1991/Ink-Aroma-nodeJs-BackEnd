const express =require('express');
const { find } = require('../models/userschema');
const router =express.Router(); 
const User = require('../models/userschema');

// find account API 
router.post('/findaccount', async(req,res)=> {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) { 
            res.status(200).json(user)
        } else {

          res.status(403).json({
            message: "Please make sure the email is correct .",
            user : user ,
            re : req.body.email
          });
        }
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
 
})










module.exports = router