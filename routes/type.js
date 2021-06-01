const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.type.findAll()
    .then(transtype=>{
        res.send(transtype);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Type"
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



Router.post("/addtype", (req, res) => {
    try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name of Type Transaction"
      });
      return;
    }
  
    // Create a Rule
    const transtype = {
      name: req.body.name,
      typekey: req.body.typekey
    };
  
    // Save Rule in the database
    db.type.create(transtype)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Type."
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
    db.type.findAll({
      where: {
        id: req.params.id
      }
    }).then(transtype =>{
        res.send(transtype)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Rule with id=" + id
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
  
    db.type.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Type was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Type with id=${id}. Maybe Type was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Rule with id=" + id
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
    db.type.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Type was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Type with id=${id}. Maybe Type was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Type with id=" + id
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