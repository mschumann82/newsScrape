var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var Article = require("./models/Article");
var Note = require("./models/Note");

const PORT = process.env.PORT || 8080;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mangoDB";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.




// Start our server so that it can begin listening to client requests.

app.get("/", function(req, res) {
  
    res.render("index");
  });

// app.get("/saved", function(req, res) {
  
//     res.render("saved");
//   }); never used



// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  const results = [];
  // First, we grab the body of the html with request
  request("https://www.yahoo.com/news/", function(error, response, html) {

  // Load the body of the HTML into cheerio
  const $ = cheerio.load(html);

  // Empty array to save our scraped data
  
 
  
    
  $("li.js-stream-content").each(function(i, element) {
      // Save an empty result object
      const link = $(element).find("a").attr("href");
			const title = $(element).find("a").text().trim();
			const post = $(element).find("p").text().trim();
      // Add the text and href of every link, and save them as properties of the result object
      const result = {};
      
      result.title = title;
        
      result.link = link;
      
			result.post = post;
		
      results.push(result);
      
        
    });
    

    // If we were able to successfully scrape and save an Article, send a message to the client
    
    // console.log(results);
    res.json(results);
    
  });
  console.log("scrape");
  
});

app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/notes", function(req, res) {
  // Grab every document in the Articles collection
  Note.find({})
    .then(function(dbNote) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles", function(req, res) {
      const link = req.body.link;
      const title = req.body.title;
      const post = req.body.post;
      console.log(title);
      console.log(link);
      console.log(post);
      const result = {};
      
      result.title = title;
        
      result.link = link;
      
			result.post = post;

  Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle + "db article");
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
          
        });
  console.log("res");
});

app.get("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Note.findOne({ _id: req.params.id })
    
    .then(function(dbNote) {
      
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/articles/:id" , function(req, res) {
  
  Article.remove({ _id: req.params.id })
    .then(function(dbArticle) {
      
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Note.update({ _id: req.params.id }, {$set: {"title": req.body.title, "body": req.body.body}})
    
    .then(function(dbNote) {
      
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
  
});
