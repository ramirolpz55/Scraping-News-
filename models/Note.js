// REQUIRE MONGOOSE 
var mongoose = require('mongoose');
// CREATE A SCHEMA CLASS
var Schema = mongoose.Schema;

// CREATE THE NOTE SCHEMA 
var NoteSchema = new Schema({
  // TITLE WILL BE A STRING 
  title: {
    type:String
  },
  // BODY OF THE NOTE WILL BE A STRING 
  body: {
    type:String
  }
});

// CREATE THE NOTE MODEL WITH THE NOTE SCHEMA 
var Note = mongoose.model('Note', NoteSchema);

// TIME TO EXPORT THE NOTE MODEL 
module.exports = Note;