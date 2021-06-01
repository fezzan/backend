const express = require('express');
const Router = express.Router();
const db = require("../models");

Router.get("/all", (req,res)=>{
    try{
    db.ticket.findAll()
    .then(myticket=>{
        res.send(myticket);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Tickets"
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



Router.post("/addticket", (req, res) => {
    try{
    // Validate request
    if (!req.body.cost) {
      res.status(400).send({
        message: "Please Enter Cost of the Ticket"
      });
      return;
    }
  
    // Create a Ticket
    const myticket = {
      cost: req.body.cost,
    };
  
    // Save Ticket in the database
    db.ticket.create(myticket)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Ticket."
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
    db.ticket.findAll({
      where: {
        id: req.params.id
      }
    }).then(myticket =>{
        res.send(myticket)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving ticket with id=" + id
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
  
    db.ticket.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Ticket was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete ticket with id=${id}. Maybe ticket was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete ticket with id=" + id
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
    db.ticket.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Ticket was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Ticket with id=${id}. Maybe ticket was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating ticket with id=" + id
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