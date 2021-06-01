const express = require('express');
const Router = express.Router();
const db = require("../models");
const gifts = require('../models/gifts');

Router.get("/all", (req,res)=>{
    try{
    db.gifts.findAll()
    .then(mygift=>{
        res.send(mygift);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Gifts"
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



Router.post("/addgift", (req, res) => {
    try{
    // Validate request
    if (!req.body.description) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }
  
    // Create a Gift
    const mygift = {
      name:req.body.name
    };
  
    // Save Gift in the database
    db.gifts.create(mygift)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Gift."
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
    db.gifts.findAll({
      where: {
        id: req.params.id
      }
    }).then(mygift =>{
        res.send(mygift)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Gift with id=" + id
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
  
    db.gifts.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Gift was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Gift with id=${id}. Maybe Gift was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Gift with id=" + id
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


  Router.put("/edit/:id", (req, res) => {
      try{
    const id = req.params.id;
    db.gifts.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Gift was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Gift with id=${id}. Maybe Gift was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Gift with id=" + id
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