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

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories };