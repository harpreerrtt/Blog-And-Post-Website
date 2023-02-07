/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students.
 * 
 *  Name: Harpreet Singh Student ID: 158928218 Date: feb 7th, 2023
 *
 *  Cyclic Web App URL: ________________________________________________________
 *
 *  GitHub Repository URL: ______________________________________________________
 *
 ********************************************************************************/

var blog_service = require("./blog-service.js"); //inputing local module
var express = require("express");
const fs = require('fs');
var app = express();
var blog_service = require('./blog-service')
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
    blog_service.getPublishedPosts()
        .then((posts) => { res.send(posts) })
        .catch((messagge) => { message: messagge });
})

///posts route
app.get("/posts", function(req, res) {
    blog_service.getAllPosts()
        .then((posts) => { res.send(posts) })
        .catch((messagge) => { message: messagge });
})


//  "categories"
app.get("/categories", (req, res) => {
    blog_service.getCategories()
        .then((categories) => { res.json(categories) })
        .catch((messagge) => { message: messagge });
})

// route == unmatched
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/data/404_not_found.JPG');
});

//listen to 8080 port 
blog_service.initialize()
    .then(() => { app.listen(HTTP_PORT, onHttpStart) }) //call onHttpStart
    .catch(function(msg) { console.log(msg) });