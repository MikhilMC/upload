const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePictureId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ProfilePicture'
  }
})

module.exports = mongoose.model('User', UserSchema);