const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.useranswer.findAll()
    .then(ua=>{     
        res.send(ua);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving the User Answers"
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



Router.post("/adduseranswer", (req, res) => {
    try{
    // Validate request
    if (!req.body.users_id || !req.body.question_id) {
      res.status(400).send({
        message: "Please Enter the required ids"
      });
      return;
    }
  
    // Create a User Answer
    const ua = {
      users_id: req.body.users_id,
      question_id: req.body.question_id
    };
  
    // Save User Answer in the database
    db.useranswer.create(ua)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User Answer."
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
    db.useranswer.findAll({
      where: {
        id: req.params.id
      }
    }).then(ut =>{
      if(cat.length==0){
        res.status(500).send({
          message: "The User Answer with id="+id+" Does Not Exist"
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
  
    db.useranswer.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User Answer was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User Answer with id=${id}. Maybe User Answer was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User Answer with id=" + id
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
    db.useranswer.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User Answer was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User Answer with id=${id}. Maybe User Answer was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User Answer with id=" + id
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