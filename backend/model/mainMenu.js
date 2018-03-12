const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MainMenuSchema = new Schema({
     id: Number,
     item: String,
     schemaName:String,
     current: Boolean,
     tabelCount: Number,
     tableId: Array
});

module.exports = mongoose.model('MainMenu', MainMenuSchema);