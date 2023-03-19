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
//global array 
var categories = [];
var posts = [];
//importing module
const fs = require('fs');

//import Sequelize
const Sequelize = require("sequelize");

//object sequelize that connect with my elephant server
var sequelize = new Sequelize('kcghbkbm', 'kcghbkbm', 'tE1S-o8jDJ__-Yd5jlZKvUFLL7EJq882', {
    host: 'hansken.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

//defining table for post
var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

//defining table for categories
var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

//relationship b/w post & category
Post.belongsTo(Category, { foreignKey: 'category' });

//copy data from json to global array=>  //initialze function
function initialize() {
    // promise
    return new Promise((resolve, reject) => {
        sequelize
            .authenticate()
            .then(function() {
                resolve("Connection is made successfully.")
            })
            .catch(function(err) {
                reject("unable to sync the database")
            });
    });

}

// output all posts  with published =true
function getPublishedPosts() {

    return new Promise((resolve, reject) => {
        //extract all posts with published
        Post.findAll({
                where: {
                    published: true
                }
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });

}

// output all posts
function getAllPosts() {
    return new Promise((resolve, reject) => {

        //extract all posts
        Post.findAll({})
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject(err)
            })
    });


}

// output all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        //extract all categories
        Category.findAll({})
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });


}

//add new post by post method
function addPost(postData) {

    //confirming publish is not null
    postData.published = (postData.published) ? true : false;
    //confirming blank string set to NULL
    for (let property in postData) {
        if (postData[property] === "") {
            postData[property] = null;
        }
    }
    //date property
    postData.postDate = new Date();

    return new Promise((resolve, reject) => {
        sequelize.sync().then(function() {
            Post.create({
                    body: postData.body,
                    title: postData.title,
                    postDate: postData.postDate,
                    featureImage: postData.featureImage,
                    published: postData.published,
                    categoryId: postData.categoryId // Use the foreign key field name
                })
                .then(function() {
                    resolve("object created successfully")
                })
                .catch(function() {
                    reject("unable to create post")
                })
        });
    });

}

//get post for required category
function getPostsByCategory(category_passed) {
    return new Promise((resolve, reject) => {
        //extract all posts
        Post.findAll({
                attributes: ['body', 'title', 'postDate', 'featureImage', 'published'],
                where: {
                    //mostly wrong be cause of strind  == number
                    id: category_passed
                }
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });

}

//get post by min_date
function getPostsByMinDate(minDateStr) {

    return new Promise((resolve, reject) => {

        //operator to compare date
        const { gte } = Sequelize.Op;

        //extract all posts
        Post.findAll({
                attributes: ['body', 'title', 'postDate', 'featureImage', 'published'],
                where: {
                    postDate: {
                        [gte]: new Date(minDateStr)
                    }
                }

            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });


}

//get post by id
function getPostsById(id_passed) {

    return new Promise((resolve, reject) => {
        //extract all posts
        Post.findAll({
                where: {
                    id: id_passed
                }
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });

}

//return both published and posts and category
function getPublishedPostsByCategory(category_passed) {

    return new Promise((resolve, reject) => {
        //extract all posts with published
        Post.findAll({
                where: {
                    published: true,
                    id: category_passed
                }
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject("no results returned")
            })
    });


}

//adding new category
function addCategory(categoryData) {

    //confirming blank string set to NULL
    for (let property in categoryData) {
        if (categoryData[property] === "") {
            categoryData[property] = null;
        }
    }
    return new Promise((resolve, reject) => {
        Category.create({
                category: categoryData.category
            })
            .then(function() {
                resolve("object created successfully")
            })
            .catch(function() {
                reject("unable to create category")
            })
    });
}

//deleting category
function deleteCategoryById(id_passed) {

    return new Promise((resolve, reject) => {
        Category.destroy({
                where: { id: id_passed }
            }).then(() => { resolve("Category was deleted successfiully") })
            .catch(() => { reject("Operation Unsuccessfull") })
    });
}

//deleting post
function deletePostById(id_passed) {
    return new Promise((resolve, reject) => {
        Post.destroy({
                where: { id: id_passed }
            }).then(() => { resolve("Post was deleted successfiully") })
            .catch(() => { reject("Operation Unsuccessfull") })
    });
}


module.exports = { deletePostById, deleteCategoryById, addCategory, getPublishedPostsByCategory, getPostsById, getPostsByCategory, getPostsByMinDate, addPost, initialize, getAllPosts, getPublishedPosts, getCategories };