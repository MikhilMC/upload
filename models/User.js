if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("start");
  })
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureName: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("User", UserSchema);
