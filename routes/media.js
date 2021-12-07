if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const path = require("path");
const Grid = require("gridfs-stream");

const router = express.Router();

const mongoURI = process.env.MONGO_URI;
const connection = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection.on("error", (error) => {
  console.log("DB connection error occured");
  console.log(error);
});

let gfs;
connection.once("open", () => {
  console.log("Connected to DB successfully.");
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("ProfilePicture");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      const filename = file.originalname;
      const fileInfo = {
        filename,
        bucketName: "ProfilePicture",
      };
      return fileInfo;
    } else {
      return null;
    }
  },
});

const upload = multer({ storage });

router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (err) {
      console.log(err);
      res.send(err);
    }

    if (!files || files.length === 0) {
      res.send({ error: "No files available" });
    }

    res.send(files);
  });
});

router.get("/file/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err) {
      console.log(err);
      res.send(err);
    }

    if (!file || file.length === 0) {
      res.send({ error: "File not available" });
    }

    res.send(file);
  });
});

router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err) {
      console.log(err);
    }

    // File does not exists
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No image exists",
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ error: "Not an image" });
    }
  });
});

module.exports = router;
module.exports.upload = upload;
