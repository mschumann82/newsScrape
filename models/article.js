// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
const ArticleSchema = new Schema({
  
  title: {
    type: String,
    required: true,
    unique: true
  },
 
  post: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

//removing an article should result in removing all its dependent notes.
// ArticleSchema.pre('remove', function(next) {
//   var noteIdArray = this.note;
//   noteIdArray.map(function(noteId) {
//     this.model('notes').remove({_id:noteId})
//   });
//   next();
// });
// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;

//article