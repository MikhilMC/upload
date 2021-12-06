if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const upload = require('../helper/media');
const User = require("../models/User");

const router = express.Router();

const mongoURI = process.env.MONGO_URI;

const client = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('start');
})
.catch(err => {
  console.error('App starting error:', err.stack);
  process.exit(1)
});

// client.connect()
//   .then(() => {
//      console.log('start');
//   })
//   .catch(err => {
//      console.error('App starting error:', err.stack);
//      process.exit(1)
//   });

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
