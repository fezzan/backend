const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.category.findAll()
    .then(cat=>{     
        res.send(cat);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving the Categories"
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



Router.post("/addcategory", (req, res) => {
    try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }
  
    // Create a Category
    const cat = {
      name: req.body.name,
    };
  
    // Save Category in the database
    db.category.create(cat)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Category."
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
    db.category.findAll({
      where: {
        id: req.params.id
      }
    }).then(cat =>{
      if(cat.length==0){
        res.status(500).send({
          message: "The Category with id="+id+" Does Not Exist"
        })
      }
      else{
        res.send(cat)
      }
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Category with id=" + id
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
  
    db.category.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Category was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Category with id=" + id
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
    db.category.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Category was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Category with id=" + id
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