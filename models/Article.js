// REQUIRE MONGOOSE 
var mongoose = require('mongoose');
// CREATE THE SCHEMA CLASS
var Schema = mongoose.Schema;

// CREATE THE ARTICLE SCHEMA 
var ArticleSchema = new Schema({
  // ARTICLE TITLE WILL BE A STRING 
  title: {
    type:String,
    required:true
  },
  // LINK WILL BE A STRING AND IT IS REQUIRED 
  link: {
    type:String,
    required:true
  },
  // THIS SAVES ONE NOTES OBJECTSID 
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});

// CREATE THE ARTICLE MODEL WITH THE ARTICLE SCHEMA 
var Article = mongoose.model('Article', ArticleSchema);

// NOW WE WILL EXPORT THE ARTICLE 
module.exports = Article;