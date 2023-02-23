/*********************************************************************************
 *  WEB322 – Assignment 03
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students.
 * 
 *  Name: Harpreet Singh 
 *   Student ID: 158928218 
 *  Date: feb 7th, 2023
 *
 *  Cyclic Web App URL: https://lavender-camel-coat.cyclic.app
 *
 *  GitHub Repository URL: git@github.com:harpreerrtt/web322-app.git
 *                      or https://github.com/harpreerrtt/web322-app
 *
 ********************************************************************************/

var blog_service = require("./blog-service.js"); //inputing local module
//file module
const fs = require('fs');

// express module
var express = require("express");
var app = express();

//multer module                                              
const multer = require("multer");
const upload = multer();

//cloudinary module for online storage
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

//handlebars module immport
const exphbs = require("express-handlebars");

//setting execute engine for handlebar files 
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {

        //this is used to highlight the active navbar element pass to middleware
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        //needed later on
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }

    }
}));
app.set('view engine', '.hbs');


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

//my cloudinary profile
cloudinary.config({
    cloud_name: "dofcvivdm",
    api_key: "277122192345838",
    api_secret: "KaLcW8q2ziJBi0nrWOepXtMFfiA",
    secure: true
});

//buil in static middleware
app.use(express.static('public'));


//middleware to highlight the navigation bar
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

//redirect / to /about function 
app.get("/", (req, res) => {
    res.render('about', {
        layout: "main"
    })
})


//ouputing about.html to /about
app.get("/about", (req, res) => {
    res.render('about', {
        layout: "main"
    })
})



// "/blog" respond and returning published = true objects from posts.json
app.get("/blog", (req, res) => {
    blog_service.getPublishedPosts()
        .then((posts) => { res.send(posts) })
        .catch((messagge) => { message: messagge });
})

// "route for  add posts"
app.get("/posts/add", function(req, res) {
    res.render('addPost', {
        layout: "main"
    })
})

///posts route for defined categories or for all
app.get("/posts", function(req, res) {
    const category = req.query.category;
    const minDatestr = req.query.minDate;


    if (category) {
        blog_service.getPostsByCategory(category)
            .then((posts) => { res.send(posts) })
            .catch((message) => { res.status(500).send(message) });
    } else if (minDatestr) {
        blog_service.getPostsByMinDate(minDatestr)
            .then((posts) => { res.send(posts) })
            .catch((message) => { res.status(400).json({ error: message }) });
    } else {
        blog_service.getAllPosts()
            .then((posts) => { res.send(posts) })
            .catch((message) => { res.status(500).send(message) });
    }
})

//get post by id
app.get("/posts/:id", (req, res) => {
    const id = req.params.id;

    if (id) {
        blog_service.getPostsById(id)
            .then((posts) => { res.send(posts) })
            .catch((message) => { res.status(500).send(message) });
    }
})

//  "categories"
app.get("/categories", (req, res) => {
    blog_service.getCategories()
        .then((categories) => { res.json(categories) })
        .catch((messagge) => { message: messagge });
})

// post data 
app.post("/posts/add", upload.single("featureImage"), function(req, res, next) {

    //taken from prof
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processPost(uploaded.url);
        });
    } else {
        processPost("");
    }

    function processPost(imageUrl) {
        req.body.featureImage = imageUrl;

        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blog_service.addPost(req.body)
            .then((newPostData) => {
                console.log("New blog post added:", newPostData);
                res.redirect('/posts');
            })
            .catch((error) => {
                console.log("Error occurred:", error);
                res.status(500).send(error);
            });

    }


})

// route == unmatched
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/data/404_not_found.JPG');
});



//listen to 8080 port 
blog_service.initialize()
    .then(() => { app.listen(HTTP_PORT, onHttpStart) }) //call onHttpStart
    .catch(function(msg) { console.log(msg) });