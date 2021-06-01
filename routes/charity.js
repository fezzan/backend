const express = require('express');
const { upload } = require('../common/multer');
const Router = express.Router();
const db = require("../models");


//const morgan = require('morgan');


Router.get("/all", (req,res)=>{
  try{
    db.charity.findAll()
    .then(charity=>{
        res.send(charity);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Charities"
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



Router.post("/addcharity",upload.single("picture"), (req, res) => {
  try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }
    else if(!req.file){
        res.status(400).send({
          message: "No file recieved"
        });
        return;
      }
    // Create a Charity
    const charity = {
      name: req.body.name,
      picture: req.file.filename,
      description: req.body.description
    };
  
    // Save Charity in the database
    db.charity.create(charity)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Charity."
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
      db.charity.findAll({
        where: {
          id: req.params.id
        }
      }).then(char =>{
          res.send(char)
      }).catch(err => {
          res.status(500).send({
            message: "Error retrieving Charity with id=" + id
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
  
    db.charity.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Charity was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Charity with id=${id}. Maybe Charity was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Charity with id=" + id
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


  Router.put("/edit/:id",upload.single("picture"), (req, res) => {
   
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
    db.charity.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Charity was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Chairty with id=${id}. Maybe Charity was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Charity with id=" + id
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