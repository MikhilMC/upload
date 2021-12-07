const express = require("express");

const media = require('./media');
const User = require("../models/User");

const router = express.Router();

router.post("/", media.upload.single("file"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  const fileName = req.file != null ? req.file.filename : null;
  console.log(fileName);
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profilePictureName: fileName,
  });
  console.log(user);
  try {
    const newUser = await user.save();
    console.log(newUser);
    // res.send({ newUser });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

module.exports = router;
