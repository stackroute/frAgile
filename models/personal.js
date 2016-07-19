var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personalSchema = new Schema({
subject:[String],
relation:String,
object:String,
projectId:String
});


var Personal = mongoose.model('Personal', personalSchema, 'Personal');
module.exports = Personal;
