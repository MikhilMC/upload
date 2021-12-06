const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const path = require("path");
const Grid = require("gridfs-stream");

const mongoURI = process.env.MONGO_URI;
const connection = mongoose.createConnection(mongoURI, {});

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

module.exports = upload;