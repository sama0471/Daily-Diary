//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Create, Read and Delete Blog Posts.";
const aboutContent = "My name is Sama Ruksar R. I am an undergraduate pursuing my Bachelor's Degree from IIT (ISM) DHANBAD in Electrical Engeneering. I have a keen interest in problem solving and am a full stack web developer. I am also a part of media body of my college Mailer Deamon and music club Manthan. My hoobies include singing and learning stock market.";
const contactContent = "Email : samaruksar22@gmail.com ";

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://Sama:2HvjJChxRTpAN3f4@cluster0.dtqa8hx.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("Successfully connected to database");
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);
console.log(Post, "hi");
app.get("/", function(req,res){
  Post.find({},function(err, posts){
    res.render("home",{
      homePara: homeStartingContent,
      posts: posts
    });
  })
  // res.send("Hi test 123!");
 });


app.post("/deletePost", function(req, res){
  const deletePostId = req.body.remove2;
  Post.findByIdAndRemove(deletePostId, function(err){
    if(!err){
      console.log("Successfully deleted the blog post");
      res.redirect("/");
    }
  })
})

app.get("/about", function(req,res){
  res.render("about",{aboutPara:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactPara:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{});
});

app.post("/compose", function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId}, function(err,post){
    res.render("post",{
      postHead: post.title,
      postBody: post.content
    });
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
