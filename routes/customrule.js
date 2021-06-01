const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
  try{
    db.customrule.findAll()
    .then(crule=>{
        res.send(crule);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Custome Rules"
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



Router.post("/addcustomrule", (req, res) => {
  try{
    // Validate request
    if (!req.body.description) {
      res.status(400).send({
        message: "Please Enter Description"
      });
      return;
    }
  
    // Create a Custom Rule
    const crule = {
      description: req.body.description,
      game_id: req.body.game_id
    };
  
    // Save Custom Rule in the database
    db.customrule.create(crule)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Custom Rule."
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
    db.customrule.findAll({
      where: {
        game_id: req.params.id
      }
    }).then(crule =>{
        res.send(crule)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Custom Rule with id=" + id
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
  
    db.customrule.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Custome Rule was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Custom Rule with id=${id}. Maybe Custom Rule was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Custom Rule with id=" + id
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
    db.customrule.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Custom Rule was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Custom Rule with id=${id}. Maybe Custom Rule was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Custom Rule with id=" + id
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