var mongoose = require('mongoose'),
 templateSchema = new mongoose.Schema({
   labelTemplates: [
   {
     name: String,
     colorCode: String,
     colorName:String
   }
   ],
   listTemplate: [
   {
     group: String,
     listName: String
   }
 ]

 }),
 Template = mongoose.model('Template', templateSchema, "Templates");

module.exports = Template;
