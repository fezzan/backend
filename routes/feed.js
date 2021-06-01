const express = require('express');
const Router = express.Router();
const db = require("../models");
const { upload } = require('../common/multer');

Router.get("/all", (req,res)=>{
  try{
    db.feed.findAll()
    .then(myfeed=>{
        res.send(myfeed);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Feeds"
        })
    });
  }
  catch(e){
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});



Router.post("/addfeed",upload.single("picture"), (req, res) => {
  try{
    // Validate request
    if (!req.body.description) {
      res.status(400).send({
        message: "Please Enter Description"
      });
      return;
    }  
    // Create a Feed
    const myfeed = {
      description: req.body.description,
      picture: req.file.filename,
      name: req.body.name,
    };
  
    // Save Feed in the database
    db.feed.create(myfeed)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Feed."
        });
      });
    }
    catch(e){
      res.status(500).send({
        success: false,
        message: e.toString()
      })
    }
  });

Router.get("/find/:id", (req, res) => {
  try{
    db.feed.findAll({
      where: {
        id: req.params.id
      }
    }).then(myfeed =>{
        res.send(myfeed)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Feed with id=" + id
        });
      });
    }
    catch(e){
      res.status(500).send({
        success: false,
        message: e.toString()
      })
    }
  });
  


  Router.delete("/delete/:id", (req, res) => {
    try{
    const id = req.params.id;
  
    db.feed.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Feed was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Feed with id=${id}. Maybe Feed was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Feed with id=" + id
        });
      });
    }
    catch(e){
      res.status(500).send({
        success: false,
        message: e.toString()
      })
    }
  });


  Router.put("/edit/:id",upload.single('picture'), (req, res) => {
    try{
      let updateObj = {
        name: req.body.name,
        description: req.body.description
      };
      if (req.file){
        req.body.picture=req.file.filename
        updateObj.picture = req.file.filename
      }
    const id = req.params.id;
    db.feed.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Feed was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Feed with id=${id}. Maybe Feed was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Feed with id=" + id
        });
      });
    }
    catch(e){
      res.status(500).send({
        success: false,
        message: e.toString()
      })
    }
  });
  


module.exports = Router;