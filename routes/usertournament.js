const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.usertournament.findAll()
    .then(ut=>{     
        res.send(ut);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving the User Tournaments"
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



Router.post("/addusertournament", (req, res) => {
    try{
    // Validate request
    if (!req.body.users_id || !req.body.tournament_id) {
      res.status(400).send({
        message: "Please Enter the required ids"
      });
      return;
    }
  
    // Create a User Tournament
    const ut = {
      users_id: req.body.users_id,
      tournament_id: req.body.tournament_id
    };
  
    // Save User Tournament in the database
    db.usertournmaent.create(ut)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User Tournament."
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
    db.usertournmaent.findAll({
      where: {
        id: req.params.id
      }
    }).then(ut =>{
      if(cat.length==0){
        res.status(500).send({
          message: "The User Tournament with id="+id+" Does Not Exist"
        })
      }
      else{
        res.send(ut)
      }
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving User Tournament with id=" + id
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
  
    db.usertournmaent.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User Tournament was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User Tournament with id=${id}. Maybe User Tournament was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User Tournament with id=" + id
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
    db.usertournmaent.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User Tournament was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User Tournament with id=${id}. Maybe User Tournament was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User Tournament with id=" + id
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