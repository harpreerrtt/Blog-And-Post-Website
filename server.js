var blog_service = require("./blog-service.js"); //inputing local module
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

//redirect / to /about function 
app.get("/", (req, res) => {
    res.redirect('/about') //redirection
})

//buil in static middleware
app.use(express.static('public'));

//ouputing about.html to /about
app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/views/about.html')
})


// "/blog" respond and returning objects from posts.json
app.get("/blog", (req, res) => {

})


//listen to 8080 port 
app.listen(HTTP_PORT, onHttpStart); //call onHttpStart