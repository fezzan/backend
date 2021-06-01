const express = require('express');
const { upload } = require('../common/multer');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.game.findAll()
    .then(mygame=>{
        res.send(mygame);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Games"
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



Router.post("/addgame",upload.single("picture"), (req, res) => {
    try{
    // Validate request
    if (!req.body.gamename) {
      res.status(400).send({
        message: "Please Enter Description"
      });
      return;
    }
    else if(!req.body.ticketcost){
        res.status(400).send({
            message: "Please Enter Ticket Cost"
        });
        return;
    }
  
    // Create a Game
    const mygame = {
      gamename: req.body.gamename,
      picture: req.file.filename,
      round_id: req.body.round_id,

    };
  
    // Save Game in the database
    db.game.create(mygame)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Game."
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
    db.game.findAll({
      where: {
        round_id: req.params.id
      }
    }).then(mygame =>{
        res.send(mygame)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Game with id=" + id
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
  
    db.game.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Game was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Game with id=" + id
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
          gamename: req.body.gamename,
          round_id: req.body.round_id,
        };
        if (req.file){
          req.body.picture=req.file.filename
          updateObj.picture = req.file.filename
        }
    const id = req.params.id;
    db.game.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Game was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Game with id=" + id
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