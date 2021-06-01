const express = require('express');
const Router = express.Router();
const db = require("../models");
const { upload } = require('../common/multer');

Router.get("/all", (req,res)=>{
    try{
    db.sponsor.findAll()
    .then(sponsor=>{
        res.send(sponsor);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Sponsors"
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



Router.post("/addsponsor",upload.single("picture"), (req, res) => {
    try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }
  
    // Create a Sponsor
    const sponsor = {
      name: req.body.name,
      picture: req.file.filename,
    };
  
    // Save Sponsor in the database
    db.sponsor.create(sponsor)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the sponsor."
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
    db.sponsor.findAll({
      where: {
        id: req.params.id
      }
    }).then(sponsor =>{
        res.send(sponsor)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving sponsor with id=" + id
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
  
    db.sponsor.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "sponsor was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete sponsor with id=${id}. Maybe sponsor was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete sponsor with id=" + id
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
          name: req.body.name,
        };
        if (req.file){
          req.body.picture=req.file.filename
          updateObj.picture = req.file.filename
        }
    const id = req.params.id;
    db.sponsor.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "sponsor was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update sponsor with id=${id}. Maybe sponsor was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating sponsor with id=" + id
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