const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AllTablesSchema = new Schema({
     id: Number,
     tableName: String,
     schemaName:String,
     blocType:String,
     hidden: Boolean,
     date: Date
});

module.exports = mongoose.model('Alltables', AllTablesSchema);