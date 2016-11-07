//REQUIRE ALL DEPENDENCIES NEEDED
//==============================
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
//REQUIRE THE MODELS WE CREATED
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

//HOME PAGE WHICH SHOWS THE TITLE
//==============================
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Scrpaing News!' });
});

// SCRAPES THE NY TIMES WEBAPAGE
//==============================
router.get('/scrape', function(req, res) {
    // GRAB THE NY TIMES BODY WITH AN HTML REQUEST. 
    request('http://www.nytimes.com', function(error, response, html) {
        // LOADS THE BODY INTO NPMPACKAGE CHEERIO AND SAVES IT WITH $.
        var $ = cheerio.load(html);
        // SCRAPES THE DIV CLASS WITH AN H2 IN STORY-HEADING.
        $('h2.story-heading').each(function(i, element) {

            // SAVES AN EMPTY RESULT IN AN OBJECT. 
            var result = {};

            // SAVE THE TEXT OF EACH LINK ENCLOSED IN THE CURRENT ELEMENT.
            result.title = $(this).text();
            // SAVE THE HREF VALUE OF EACH LINK ENCLOSED IN THE CURRENT ELEMENT.
            result.link = $(this).children().attr('href');

            //CONSOLE.LOG TO SEE IF DATA WAS SCRAPED AND IF IT IS THERE. 
            console.log(result.title);
            console.log(result.link);

            /* WITH THE ARTICLE MODEL WE CREATED CREATE A NEW ENTRY.
               WITH (RESULT) BEING PASSED IN WE MAKE SURE TO PASS IN THE TITLE AND THE LINK WHICH IS WHAT WE SCRAPED FOR. */
            var entry = new Article(result);

            // ONCE WE HAVE THE RESULT SAVE IT TO THE DATABASE USING. 
            entry.save(function(err, doc) {
                // WILL LOG IF THERE WAS AN ERROR SAVING TO THE DB. 
                if (err) {
                    console.log(err);
                } else {
                    //LOG THE DOC
                    console.log(doc);
                }
            });

        });
    });
    // SEND TO THE BROWSER A MESSAGE TO SHOW SCRPAE WAS COMPLETE.
    res.send("Congratulations! Your Scrape Was Complete");
});

// GET ALL ARTICLES THAT WERE SCRAPED FROM NY TIMES THAT ARE IN MONGO DB DATBASE.
//==============================
router.get('/articles', function(req, res) {
    // FIND ALL ARTICLES IN THE DATABASE.
    Article.find({}, function(err, doc) {
        // IF ANY ERRORS IT WILL LOG.
        if (err) {
            console.log(err);
        } else {
            //SEND THE DOC TO THE BROWSER AS A JSON OBJECT.
            res.json(doc);
        }
    });
});

// GRAB AN ARTICLE BY ITS OBJECTID. 
//==============================
router.get('/articles/:id', function(req, res) {
    // FIND ONE ARTICLE WITH ID# THAT IS PASSE DIN THE PARAM WHICH THEN FINDS IT IN OUR DATABASE .
    Article.findOne({ '_id': req.params.id })
        // THIS POPULATES ALL OF THE NOTES ASSOCIATED WITH THE SPECIFICED ID.
        .populate('note')
        // THIS EXECUTES OUR QUERY.
        .exec(function(err, doc) {
            // WILL LOG AN ERROR IF ANY.
            if (err) {
                console.log(err);
            } else {
                //IF A SUCCESS SEDN THE DOC TO THE BROWSER AS A JSON OBJECT. 
                res.json(doc);
            }
        });
});

/* THIS WILL REPLACE THE EXISITING NOTE OF A ARTICLE WITH A NEW ONE.
   PLEASE NOTE: IF A NOTE DOES NOT EXIST FOR AN ARTICLE MAKE THE POSTED NOTE THE NEW NOTE FOR THAT SPECIFIC ARTICLE.*/ 
   //==============================
router.post('/articles/:id', function(req, res) {
    // CREATE A NEW NOTE AND PASS THE REQ.BODY TO THE ENTRY.
    var newNote = new Note(req.body);

    // THIS WILL SAVE THE NEW NOTE TO THE DATABASE. 
    newNote.save(function(err, doc) {
        // IF ANY ERROR PLEASE LOG.
        if (err) {
            console.log(err);
        } else {
            /* THIS WILL FIND THE ARTICLE THE USER HAS OPEN AND WILL QUERY OUR DATABSE FOR THAT SPECIFIC ARTICLE GETTING THE PARAMS.ID FROM
            THE URL AND WILL ALSO UPDATE THE NOTE WITH ONE WE JUST SAVED. */
            Article.findOneAndUpdate({
                    '_id': req.params.id
                }, { 'note': doc._id })
                // EXECUTES THE QUERY FROM ABOVE.
                .exec(function(err, doc) {
                    // IF ANY ERRORS IT WILL LOG THEM.
                    if (err) {
                        console.log(err);
                    } else {
                        // SEND THE FINALIZED DOC TO THE BROWSER.
                        res.send(doc);
                    }
                });
        }
    });
});
//EXPORT THE ROUTER TO BE USED ELSEWHERE.
//==============================
module.exports = router;
