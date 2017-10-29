// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({

  post_id: {
    type: String,
    required: true
  },
  noteText: {
    type: String,
    required: true
  }
});


// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
