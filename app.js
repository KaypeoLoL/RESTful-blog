var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(sanitizer());

//MONGOOSE/MODEL config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog  = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else{
      res.render("index", {blogs: blogs});
    }
  });
});
//NEW
app.get("/blogs/new", function(req, res) {
  res.render("new");
});
//CREATE
app.post("/blogs", function(req, res){
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  var data = req.body.blog;
  Blog.create(data, function(err, newBlog){
    if(err){
      console.log(err);
    } else {
      //redirect to the index
      res.redirect("/blogs");
    }
  });
});
//SHOW
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
    
});
//EDIT
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE
app.delete("/blogs/:id", function(req, res){
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});








app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
})