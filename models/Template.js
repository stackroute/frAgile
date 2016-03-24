var mongoose = require('mongoose'),
 labelTemplateSchema = new mongoose.Schema({
   label: [
   {
     name: String,
     colorCode: String,
   }
   ],
   list: [
   {
     group: String,
     listName: String
   }
  ]
 }),
 LabelTemplate = mongoose.model('LabelTemplate', labelTemplateSchema, "labelTemplate_collection");

module.exports = LabelTemplate;
