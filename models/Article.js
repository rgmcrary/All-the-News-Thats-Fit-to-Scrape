// Require mongoose
var mongoose = require('mongoose');
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // Title is a required string
  post_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // Link is a required string
  link: {
    type: String,
    required: true
  },
  // Summary is a required string
  summary: {
    type: String,
    required: true
  },
  saved:{
    type: Boolean,
    required: false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;
