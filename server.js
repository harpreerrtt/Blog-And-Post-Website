var blog_service = require("./blog-service.js"); //inputing local module
var express = require("express");
const fs = require('fs');
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

//buil in static middleware
app.use(express.static('public'));



//redirect / to /about function 
app.get("/", (req, res) => {
    res.redirect('/about') //redirection
})


//ouputing about.html to /about
app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/views/about.html')
})



// "/blog" respond and returning published = true objects from posts.json
app.get("/blog", (req, res) => {
    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err;
        const posts = JSON.parse(data);
        const publishedPosts = posts.filter(post => post.published === true);
        res.send(publishedPosts);
    })
})

///posts route
app.get("/posts", function(req, res) {
    fs.readFile('./data/posts.json', (err, data) => {
        if (err) throw err;
        const posts = JSON.parse(data);
        res.send(posts);
    })
})


//  "categories"
app.get("/categories", (req, res) => {
    fs.readFile("./data/categories.json", (err, data) => {
        if (err) throw err;
        const categories = JSON.parse(data);
        res.send(categories);
    })
})

// route == unmatched
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/data/404_not_found.JPG');
});

//listen to 8080 port 
app.listen(HTTP_PORT, onHttpStart); //call onHttpStart