/* Scraping News! ** BACKEND
==================== */

// DEPENDANCIES
// ==================== 
var express = require('express');
var app = express();
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var logger = require('morgan'); // LOGS ALL INFO TO THE TERMINAL 

// SET THE APP UP WITH MORGAN, BODY-PARSER AND A STATIC FOLDER 
// ==================== 
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

// DATABASE CONFIGURATION
// ==================== 
var mongojs = require('mongojs');
var databaseUrl = "scrapedNews";
var collections = ["scrapedArticles"];

// HOOK MONGO.JS CONFIGURATION TO THE DB VARIABLE
//==================== 
var db = mongojs(databaseUrl, collections);

//  THIS MAKES SURE THAT ANY ERRORS ARE LOGGED IF MONGODB RUNS INTO AN ISSUE
// ==================
db.on('error', function(err) {
    console.log('Database Error:', err);
});

// MAIN ROUTE (THIS WILL PRINT A SIMPLE HELLO WORLD MESSAGE)
//==================== 
app.get('/', function(req, res) {
    res.send("Hello World");
    console.log("Hello");
});

// RETRIEVE DATA FROM THE DB 
// ===================
app.get('/all', function(req, res) {
    // FIND ALL RESULTS FROM THE scrapedArticles COLLECTION IN THE DB
    db.scrapedArticles.find({}, function(err, found) {
        // THROW ANY ERRORS TO THE CONSOLE 
        if (err) {
            console.log(err);
        }
        // IF THERE ARE NO ERROS, SEND THE DATA TO THE BROWSER IN A JSON
        else {
            res.json(found);
            // console.log("Hello");
        }
    });


}); // SCRAPE DATA FROM A SITE AND PLACE IT INTO MONGODB DB
// ===================
app.get('/scrape', function(req, res) {
    // MAKE A REQUEST FOR THE NEWS SECTION OF NYTIMES
    request('http://www.nytimes.com', function(error, response, html) {
        // LOAD THE HTML BODY FROM THE REQUEST INTO CHERRIO
        var $ = cheerio.load(html);
        // FOR EACH ELEMENT WITH A "H2.STORY-HEADING" CLASS
        $('h2.story-heading').each(function(i, element) {
            // SAVE THE TEXT OF EACH LINK ENCLOSED IN THE CURRENT ELEMENT
            var title = $(this).text();
            // SAVE THE HREF VALUE OF EACH LINK ENCLOSED IN THE CURRENT ELEMENT
            var link = $(this).children().attr('href');
            //CONSOLE.LOG TO SEE IF DATA WAS SCRAPED
            // console.log(title);
            // console.log(link);

            // IF THIS TITLE ELEMENT HAD BOTH A TITLE AND A LINK
            if (title && link) {
                // SAVE THE DATA IN THE SCRAPEDARTICLES DB 
                db.scrapedArticles.save({
                        title: title,
                        link: link
                    },
                    function(err, saved) {
                        // IF THERE ARE ERROS IN THE QUERY
                        if (err) {
                            // LOG THE ERROR
                            console.log(err);
                        }
                        // OTHERQISE, 
                        else {
                            // LOG THE SAVED DATA
                            console.log(saved);
                        }
                    });
            }
        });
    });
    // THIS WILL SEND A SEARCH COMPLETE MESSAGE TO THE BROWSER 
    res.send("Scrape Complete");
});

// LISTEN ON PORT 3000
app.listen(3000, function() {
    console.log('App running on port 3000!');
});

module.exports = router;
