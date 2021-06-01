const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.rewards.findAll()
    .then(reward=>{
        res.send(reward);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Rewards"
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



Router.post("/addreward", (req, res) => {
    try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }
  
    // Create a Reward
    const reward = {
      name: req.body.name,
    };
  
    // Save Reward in the database
    db.rewards.create(reward)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Reward."
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
    db.rewards.findAll({
      where: {
        id: req.params.id
      }
    }).then(reward =>{
        res.send(reward)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Reward with id=" + id
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
  
    db.rewards.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Reward was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Reward with id=${id}. Maybe Reward was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Reward with id=" + id
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
    db.rewards.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Reward was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Reward with id=${id}. Maybe Reward was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Reward with id=" + id
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