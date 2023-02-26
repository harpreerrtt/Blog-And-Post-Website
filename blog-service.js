/*********************************************************************************
 *  WEB322 – Assignment 04
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
//global array 
var categories = [];
var posts = [];
//importing module
const fs = require('fs');

//copy data from json to global array=>  //initialze function
function initialize() {
    // promise
    return new Promise(function(resolve, reject) {

        fs.readFile('./data/posts.json', (err, data) => {
            if (err) {
                reject("unable to read file")
                return;
            };
            posts = JSON.parse(data);
        })


        fs.readFile('./data/categories.json', (err, data) => {
            if (err) {
                reject("unable to read file")
                return;
            };
            categories = JSON.parse(data);
        })







        resolve("Files are successfully read.");
    })
}

// output all posts  with published =true
function getPublishedPosts() {

    return new Promise(function(resolve, reject) {

        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        const publishedPosts = posts.filter(post => post.published === true);
        resolve(publishedPosts);



    })
}

// output all posts
function getAllPosts() {
    return new Promise(function(resolve, reject) {

        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        resolve(posts);

    })

}

// output all categories
function getCategories() {
    return new Promise(function(resolve, reject) {

        if (categories.length == 0) {
            reject("no results returned")
            return;
        }
        resolve(categories);

    })
}

//add new post by post method
function addPost(postData) {
    return new Promise((resolve, reject) => {

        //published property
        if (postData.published == null)
            postData.published = false;
        else
            postData.published = true;

        //new id
        postData.id = posts.length + 1;

        //adding new property post  Date
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10); // format date as YYYY-MM-DD

        postData.postDate = formattedDate;

        //appending data
        posts.push(postData);

        resolve(postData);
    })
}

//get post for required category
function getPostsByCategory(category) {

    return new Promise(function(resolve, reject) {
        //validating posts
        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        const required_posts = posts.filter((post) => post.category === parseInt(category));
        if (required_posts.length == 0) {
            reject("no results returned for given category")
            return;
        }
        resolve(required_posts);
    })
}

//get post by min_date
function getPostsByMinDate(minDateStr) {
    return new Promise(function(resolve, reject) {
        minDate = new Date(Date.parse((minDateStr))); // string to date

        //validating posts
        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        const required_posts = posts.filter((post) => Date.parse(post.postDate) >= minDate);
        if (required_posts.length == 0) {
            reject("no results returned for given date")
            return;
        }
        resolve(required_posts);
    })

}

//get post by id
function getPostsById(id) {
    return new Promise(function(resolve, reject) {

        //validating posts
        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        const required_posts = posts.find((post) => post.id === parseInt(id));

        if (!required_posts) {
            reject("no results returned for given ID")
            return;
        }
        resolve(required_posts);
    })
}

//return both published and posts and category
function getPublishedPostsByCategory(category) {

    return new Promise(function(resolve, reject) {

        if (posts.length == 0) {
            reject("no results returned")
            return;
        }
        const publishedPosts = posts.filter(post => post.published === true && post.category == category);
        resolve(publishedPosts);
    })
}



module.exports = { getPublishedPostsByCategory, getPostsById, getPostsByCategory, getPostsByMinDate, addPost, initialize, getAllPosts, getPublishedPosts, getCategories };