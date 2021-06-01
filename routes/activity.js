const express = require('express');
const Router = express.Router();
const db = require("../models");
const { QueryTypes } = require('sequelize');


Router.get("/all", async (req,res)=>{
    try{
        let projects1 = (await db.sequelize.query(` SELECT * FROM activity order by createdAt DESC;`, { try: QueryTypes.SELECT, model: db.activity, mapToModel: true }));
        res.json(projects1)
}
catch(e){
    res.status(500).send({
        success: false,
        message: e.toString()
    })
}
});



Router.post("/addactivity", (req, res) => {
    try{
    // Validate request
    if (!req.body.description) {
      res.status(400).send({
        message: "Please Enter Description"
      });
      return;
    }
  
    // Create a Rule
    const act = {
      description: req.body.description,
    };
  
    // Save Rule in the database
    db.activity.create(act)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Rule."
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
    db.activity.findAll({
      where: {
        users_id: req.params.id
      }
    }).then(act =>{
        res.send(act)
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
  
    db.activity.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rule was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Rule with id=${id}. Maybe Rule was not found!`
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
    db.activity.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rule was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Rule with id=${id}. Maybe Custom Rule was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Rule with id=" + id
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