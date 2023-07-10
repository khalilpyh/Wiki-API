const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); //use body parser

//connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
});

//db schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//db model
const Article = mongoose.model("Article", articleSchema);

/////////////////// Request targetting all Articles ////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    // Get - all articles
    Article.find()
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => res.send(err));
  })
  .post(function (req, res) {
    // Post - new article
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        res.send("New article has been successfully added to database.");
      })
      .catch((err) => res.send(err));
  })
  .delete(function (req, res) {
    // Delete - all articles
    Article.deleteMany()
      .then(() => {
        res.send("Successfully deleted all articles.");
      })
      .catch((err) => res.send(err));
  });

/////////////////// Request targetting a specific Article ////////////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    // Get - an article base on title
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        if (foundArticle) res.send(foundArticle);
        else res.send("Unable to find matching article with that title.");
      })
      .catch((err) => res.send(err));
  })
  .put(function (req, res) {
    // Put - an article base on title
    Article.replaceOne(
      //overwrite the entire record
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    )
      .then(() => {
        res.send("Successfully updated the article.");
      })
      .catch((err) => res.send(err));
  })
  .patch(function (req, res) {
    // Patch - an article base on title
    Article.updateOne(
      //update the existing record without overwrite it
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    )
      .then(() => {
        res.send("Successfully updated the article.");
      })
      .catch((err) => res.send(err));
  })
  .delete(function (req, res) {
    // Delete - an article base on title
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("Successfully deleted the corresponding article.");
      })
      .catch((err) => res.send(err));
  });

//set up port
app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
