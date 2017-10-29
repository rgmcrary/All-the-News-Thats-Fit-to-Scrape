//  Scrape and Display

// Good luck!

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var expre;
// Requiring our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
// Our scraping tools
var request = require('request');
var cheerio = require('cheerio');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Set Handlebars
var exphbs = require('express-handlebars');

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Use morgan and body parser with our app
//app.use()
app.use(logger('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect(
  'mongodb://heroku_b97jh5ds:rquv9v5kf5foa2i00te99mkl88@ds117869.mlab.com:17869/heroku_b97jh5ds'
);
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Routes
// ======

// Main route
app.get('/', function(req, res) {
  var hbsObj = {};
  Article.find({ saved: { $ne: true } }, function(error, doc) {
    if (error) {
      res.json(error);
    } else {
      hbsObj.articles = doc;
      res.render('index', hbsObj);
    }
  });
});

// View Saved Articles
app.get('/saved', function(req, res) {
  var hbsObj = {};
  Article.find({ saved: true }, function(error, doc) {
    if (error) {
      res.json(error);
    } else {
      hbsObj.articles = doc;
      res.render('saved', hbsObj);
    }
  });
});

// GET request to scrape the website
app.get('/api/scrape', function(req, res) {
  // First, we grab the body of the html with request
  request('http://www.theonion.com/', function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab the elements within the headline article tag, and do the following:
    $('article').each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and the summary and save them as properties of the result object
      result.post_id = $(this).attr('id');
      result.title = $(this)
        .find('header h1 a')
        .text();
      result.link = $(this)
        .find('header h1 a')
        .attr('href');
      result.summary = $(this)
        .find('div.item__content div.excerpt p')
        .text();

      // Create a new entry
      var entry = new Article(result);

      // Saves the results to the db
      Article.update(
        { post_id: result.post_id },
        { $setOnInsert: entry },
        { upsert: true },
        function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          } else {
            // Or log the doc
            console.log(doc);
          }
        }
      );
    });
    // Tell the browser that we finished scraping the text
    res.send('Scrape Complete');
  });
});

// Creates a new note or replaces an existing note
app.post('/api/articles/note/:id', function(req, res) {
  var noteObject = {};
  noteObject.post_id = req.params.id;
  noteObject.noteText = req.body.note;
  var newNote = new Note(noteObject);

  newNote.save(function(error, doc) {
    if (error) {
      console.error(error);
    } else {
      res.json(doc);
    }
  });
});

// This will grab all notes by article Id
app.get('/api/notes/:id', function(req, res) {
  Note.find(
    {
      post_id: req.params.id
    },
    function(error, doc) {
      if (error) {
        res.json(error);
      } else {
        res.json(doc);
      }
    }
  );
});

// Delete a note
app.put('/api/articles/note/:id', function(req, res) {
  var noteId = req.params.id;

  Note.remove({ _id: noteId }, function(error, doc) {
    if (error) {
      console.error(error);
    } else {
      res.json(doc);
    }
  });
});

// Save an Article
app.post('/api/articles/:id', function(req, res) {
  var booleanVal = req.body.saved === 'true' ? true : false;
  console.log(booleanVal);
  Article.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { saved: booleanVal } },
    function(error, doc) {
      if (error) {
        console.error(error);
      } else {
        res.json(doc);
      }
    }
  );
});

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

module.exports = app;
