/*********************************************************************************
 *  WEB322 – Assignment 05
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

//strip-js import to remove unwanted javascript
const stripJs = require('strip-js');

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
        },

        //strip-js remove unwanted javascript
        safeHTML: function(context) {
            return stripJs(context);
        },

        //helper for date
        formatDate: function(dateObj) {
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
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

//built in static middleware
app.use(express.static('public'));

//middleware to post normal data i.e. text, int, without image, etc..
app.use(express.urlencoded({ extended: true }));

//redirect / to /blog function 
app.get("/", (req, res) => {
    res.redirect("/blog")
})


//ouputing about.html to /about
app.get("/about", (req, res) => {
    res.render('about', {
        layout: "main"
    })
})

//get post by id
app.get('/blog/:id', async(req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try {

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if (req.query.category) {
            // Obtain the published "posts" by category
            posts = await blog_service.getPublishedPostsByCategory(req.query.category);
        } else {
            // Obtain the published "posts"
            posts = await blog_service.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the post by "id"
        viewData.post = await blog_service.getPostsById(req.params.id);
    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the full list of "categories"
        let categories = await blog_service.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", { data: viewData })
});


// "/blog" respond and returning published = true objects from posts.json
app.get('/blog', async(req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try {

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if (req.query.category) {
            // Obtain the published "posts" by category
            posts = await blog_service.getPublishedPostsByCategory(req.query.category);
        } else {
            // Obtain the published "posts"
            posts = await blog_service.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0];

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    } catch (err) {
        viewData.message = "no results";
    }

    try {
        // Obtain the full list of "categories"
        let categories = await blog_service.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    } catch (err) {
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", { data: viewData })

});


//middleware to highlight the navigation bar
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.get("/posts/add", (req, res) => {
    blog_service.getCategories().then((data) => {
        res.render('addPost', {
            categories: data
        })
    }).catch(() => { res.render('addPost'), { categories: [] } })

});

//route for adding category
app.get("/categories/add", (req, res) => {
    res.render('addCategory', {
        layout: "main"
    })
})

///posts route for defined categories or for all
app.get("/posts", function(req, res) {
    const category = req.query.category;
    const minDatestr = req.query.minDate;


    if (category) {
        blog_service.getPostsByCategory(category)
            .then((posts) => {
                if (posts.length > 0) {
                    res.render("posts", { data: posts })
                } else {
                    res.render("posts", { message: "no results" });
                }
            })
            .catch(() => { res.render("posts", { message: "no results" }); });
    } else if (minDatestr) {
        blog_service.getPostsByMinDate(minDatestr)
            .then((posts) => {
                if (posts.length > 0) {
                    res.render("posts", { data: posts })
                } else {
                    res.render("posts", { message: "no results" });
                }
            }).catch(() => { res.render("posts", { message: "no results" }); });
    } else {
        blog_service.getAllPosts()
            .then((posts) => {
                if (posts.length > 0) {
                    res.render("posts", { data: posts })
                } else {
                    res.render("posts", { message: "no results" });
                }
            }).catch(() => { res.render("posts", { message: "no results" }); });
    }
})


//  "categories"
app.get("/categories", (req, res) => {
    blog_service.getCategories()
        .then((categories) => {
            if (categories.length > 0) {
                res.render("categories", { data: categories })
            } else {
                res.render("categories", { message: "no results" });
            }
        })
        .catch(() => { res.render("categories", { message: "no results" }) });
})

// post new "posts" data  to table post
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

//post new category to category table
app.post("/categories/add", (req, res, next) => {

    blog_service.addCategory(req.body)
        .then((newCategoryData) => {
            console.log("New Category post added:", newCategoryData);

            res.redirect("/categories");
        })
        .catch((error) => {
            console.log("Error occurred:", error);
            res.status(500).send(error);
        });
})

//delete the category row
app.get("/categories/delete/:id", function(req, res) {

    console.log(req.params.id); // need to be deleted later on
    blog_service.deleteCategoryById(req.params.id)
        .then(() => {
            console.log("Required Category was successfully deleted.");
            res.redirect('/categories');
        })
        .catch((error) => {
            console.log("Error occurred:", error);
            res.status(500).send(error);
        })
})

//delete the post row
app.get("/posts/delete/:id", ((req, res) => {

    blog_service.deletePostById(req.params.id)
        .then(() => {
            console.log("Required Post was successfully deleted.");
            res.redirect('/posts');
        })
        .catch((error) => {
            console.log("Error occurred:", error);
            res.status(500).send(error);
            req.send("Unable to Remove post / post not found)");
        });
}))

//middleware route == unmatched
app.use((req, res) => {
    res.status(404).render("404");
});


//listen to 8080 port 
blog_service.initialize()
    .then(() => { app.listen(HTTP_PORT, onHttpStart) }) //call onHttpStart
    .catch(function(msg) { console.log(msg) });