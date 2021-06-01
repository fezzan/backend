const express = require('express');
const Router = express.Router();
const db = require("../models");
const admin = require('../models/admin');
const { QueryTypes } = require('sequelize');


Router.get("/all", (req,res)=>{
   
    try{
    db.admin.findAll()
    .then(credentials=>{     
        res.send(credentials);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving the Admins"
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





Router.get("/find/:id", (req, res) => {
  
    try{
      
   
    db.admin.findAll({
      where: {
        id: req.params.id
      }
    }).then(cat =>{
      if(cat.length==0){
        res.status(500).send({
          message: "The Admin with id="+id+" Does Not Exist"
        })
      }
      else{
        res.send(cat)
      }
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Admin with id=" + id
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
  
    db.admin.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Admin was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Admin with id=${id}. Maybe Admin was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Admin with id=" + id
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
    db.admin.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Admin was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Admin with id=${id}. Maybe Admin was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Admin with id=" + id
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

  const PRIZEMONEY = 2
  Router.post("/donate/:id", async (req, res) => {
    try{
      console.log(PRIZEMONEY)
      let projects = (await db.sequelize.query(`Select SUM (amount) Prize From transactions Where users_id =${req.params.id} AND type_typekey=${PRIZEMONEY}`, { try: QueryTypes.SELECT, model: db.transaction, mapToModel: true }));
      console.log(projects[0])
      let prize = projects[0]
      console.log(prize[0].Prize)
      let donation = prize[0].Prize
      const t = await db.sequelize.transaction();
      try {
        // Create a Transaction
        const transaction = {
          amount: -parseInt(donation),
          users_id: req.params.id,
          type_typekey: PRIZEMONEY
        };

        // Save Transaction in the database
        const insertedTransaction = await db.transactions.create(transaction, { transaction: t });
        //---------------------------------------------------------------------------//
        await t.commit();
        res.json({
          success: true,
          message: insertedTransaction
        });
      }
      catch (error) {
        // If the execution reaches this line, an error was thrown.
        // We rollback the transaction.
        await t.rollback();
        res.status(500).json({
          success: false,
          message: "Could not create user tournament",
          error: error
        });
      }
    }
    catch(e){
        res.status(500).send({
          success: false,
          message: e.toString()
        })
      }
  });
  


module.exports = Router;


