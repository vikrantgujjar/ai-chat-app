const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MusersSchema = new Schema({
     id: Number,
     first_name: String,
     last_name:String,
     email: String,
     userid: String,
     role: String,
     password: String,
     created: Date,
     modified: Date,
     active: Boolean,
     token: String
});

module.exports = mongoose.model('muser', MusersSchema);