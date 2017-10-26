//  Scrape and Display

// Good luck!

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var expre
// Requiring our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
// Our scraping tools
var request = require('request');
var cheerio = require('cheerio');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Set Handlebars
var exphbs = require("express-handlebars");

// Initialize Express
var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
mongoose.connect('mongodb://heroku_b97jh5ds:rquv9v5kf5foa2i00te99mkl88@ds117869.mlab.com:17869/heroku_b97jh5ds');
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
  res.render('index', {});
});


// A GET request to scrape the onion website
app.get('/scrape', function(req, res) {
  // First, we grab the body of the html with request
  request('http://www.theonion.com/', function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $('.headline').each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children('a')
        .text();
      result.link = $(this)
        .children('a')
        .attr('href');

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        } else {
          // Or log the doc
          console.log(doc);
        }
      });
    });
  });
  // Tell the browser that we finished scraping the text
  res.send('Scrape Complete');
});

// This will get the articles we scraped from the mongoDB
app.get('/articles', function(req, res) {
  // Grabs all of the articles
  Article.find({}, (error, doc) => {
    if (error) {
      res.error(error);
    } else {
      res.json(doc);
    }
  });
});

// This will grab an article by it's ObjectId
app.get('/articles/:id', function(req, res) {
  Article.find({
    _id: req.params.id
  })
    .populate('note')
    .then(doc => {
      res.json(doc);
    })
    .catch(error => {
      res.json(error);
    });
});

// Creates a new note or replaces an existing note
app.post('/articles/:id', function(req, res) {
  const newNote = new Note(req.body);

  note.save((error, doc) => {
    if (error) {
      console.error(error);
    } else {
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { note: doc._id } },
        function(error, doc) {
          if (error) {
            console.error(error);
          } else {
            res.json(doc);
          }
        }
      );
    }
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
