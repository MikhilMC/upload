if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const upload = require('../helper/media');
const User = require("../models/User");

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // res.send({
  //   body: req.body,
  //   file: req.file
  // });

  const fileId = req.file != null ? req.file.id : null;
  console.log(fileId);
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profilePictureId: fileId,
  });
  console.log(user);
  try {
    const newUser = await user.save();
    console.log(newUser);
    res.send({ newUser });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message });
  }
});

module.exports = router;
