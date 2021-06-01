const express = require('express');
const { upload } = require('../common/multer');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.level.findAll()
    .then(lvl=>{
        res.send(lvl);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Levels"
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



Router.post("/addlevel", (req, res) => {
    try{
    // Validate request
    if (!req.body.minxp && req.body.minxp!=0) {
      res.status(400).send({
        message: "Please Enter Minimum XP"
      });
      return;
    }
    else if(!req.body.title){
        res.status(400).send({
            message: "Please Enter Title"
        });
        return;
    }
  
    // Create a Game
    const lvl = {
      minxp: req.body.minxp,
      title: req.body.title,
    };
  
    // Save Game in the database
    db.level.create(lvl)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Level."
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
    db.level.findAll({
      where: {
        id: req.params.id
      }
    }).then(lvl =>{
        res.send(lvl)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Level with id=" + id
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
  
    db.level.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Level was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Level with id=${id}. Maybe Level was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Level with id=" + id
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
        let updateObj = {
          title: req.body.title,
          minxp: req.body.minxp,
        };
        
    const id = req.params.id;
    db.level.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Level was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Level with id=${id}. Maybe Level was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Level with id=" + id
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


// Select xosports.game.gamename, xosports.round.roundnumber from xosports.game Inner join xosports.round on game.round_id = round.id where game.ticketcost>5