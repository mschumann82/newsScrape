// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },
 
  post: {
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
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;