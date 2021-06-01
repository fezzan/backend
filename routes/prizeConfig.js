const express = require('express');
const { upload } = require('../common/multer');
const Router = express.Router();
const db = require("../models");
const { QueryTypes } = require('sequelize');
//const morgan = require('morgan');


Router.get("/all", (req,res)=>{
  try{
    db.prizeConfig.findAll()
    .then(prize=>{
        res.send(prize);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Prizes"
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



Router.post("/addprize",async (req, res) => {
  try{
   
    //Validate request
    let projects = (await db.sequelize.query(`Select * From prizeConfig Where ${'`'}rank${'`'}=${req.body.rank} AND tournament_id=${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));
  
    let prank = req.body.rank

    let rank1 = prank-1

    let rank2 = prank+1

    let projects1 = (await db.sequelize.query(`Select * From prizeConfig Where tournament_id=${req.body.tournament_id} AND ${'`'}rank${'`'}=${rank1}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));
    let projects2 = (await db.sequelize.query(`Select * From prizeConfig Where tournament_id=${req.body.tournament_id} AND ${'`'}rank${'`'}=${rank2}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));
    if (!req.body.rank) {
      res.status(400).send({
        message: "Please Enter Rank"
      });
      return;
    }
    else if(!req.body.tournament_id){
        res.status(400).send({
            message: "Tournament Id not Found"
        });
        return;
    }
    else if(projects.length!=0){
      res.status(500).send({
        success: false,
        message: "This rank already exists: "+ req.body.rank
      })
      return;
    }
    if(projects1.length==0 && projects2.length!=0){
      if(req.body.rank<projects2[0].rank && req.body.prize<=projects2[0].prize){
        console.log("If")
        res.status(500).send({
          success: false,
          message: "Prize Should be More than the next Prize which is: "+projects2[0].prize
        })
        return
      }
    }
    else if(projects2.length==0 && projects1.length!=0){
      if(req.body.rank>=projects1[0].rank && req.body.prize>=projects1[0].prize){
        res.status(500).send({
          success: false,
          message: "Current Prize Should be Less than the previous prize which is: "+projects1[0].prize
        })
        return
      }
    }
    else if(projects2.length!=0 && projects1.length!=0){
      if((req.body.rank<projects2[0].rank && req.body.prize<=projects2[0].prize) || (req.body.rank>=projects1[0].rank && req.body.prize>=projects1[0].prize)){
        res.status(500).send({
          success: false,
          message: "Current Prize Should be More than the next Prize and less the previous which is: "+projects2[0].prize+ " And "+projects1[0].prize
        })
        return
      }
    }

    // Create a Prize
    const prize = {
      rank: req.body.rank,
      prize: req.body.prize,
      tournament_id: req.body.tournament_id,
      xp: req.body.xp
    };
  
    // Save Prize in the database
    db.prizeConfig.create(prize)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Prize."
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
    db.prizeConfig.findAll({
      where: {
        tournament_id: req.params.id
      }
    }).then(prize =>{
        res.send(prize)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Prize with id=" + id
        });
      });
  }
  catch(e){
    res.status(500).send({
      success:false,
      message:e.toString()
    })
  }
  });
  


  Router.delete("/delete/:id", (req, res) => {
    try{
    const id = req.params.id;
  
    db.prizeConfig.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Prize was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Prize with id=${id}. Maybe Prize was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Prize with id=" + id
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


  Router.put("/edit/:id", async(req, res) => {
    try{
      let projects = (await db.sequelize.query(`Select * From prizeConfig Where id=${req.params.id} AND tournament_id=${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));
  
      let prank = projects[0].rank
  
      let rank1 = prank-1
  
      let rank2 = prank+1
  
      let projects1 = (await db.sequelize.query(`Select * From prizeConfig Where tournament_id=${req.body.tournament_id} AND ${'`'}rank${'`'}=${rank1}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));
      let projects2 = (await db.sequelize.query(`Select * From prizeConfig Where tournament_id=${req.body.tournament_id} AND ${'`'}rank${'`'}=${rank2}`, { try: QueryTypes.SELECT, model: db.prizeConfig, mapToModel: true }));

    if(projects1.length==0 && projects2.length!=0){
        if(projects[0].rank<projects2[0].rank && req.body.prize<=projects2[0].prize){
          console.log("If")
          res.status(500).send({
            success: false,
            message: "Prize Should be More than the next Prize which is: "+projects2[0].prize
          })
          return
        }
      }
      else if(projects2.length==0 && projects1.length!=0){
        if(projects[0].rank>=projects1[0].rank && req.body.prize>=projects1[0].prize){
          res.status(500).send({
            success: false,
            message: "Current Prize Should be Less than the previous prize which is: "+projects1[0].prize
          })
          return
        }
      }
      else if(projects2.length!=0 && projects1.length!=0){
        if((projects[0].rank<projects2[0].rank && req.body.prize<=projects2[0].prize) || (projects[0].rank>=projects1[0].rank && req.body.prize>=projects1[0].prize)){
          res.status(500).send({
            success: false,
            message: "Current Prize Should be More than the next Prize and less the previous which is: "+projects2[0].prize+ " And "+projects1[0].prize
          })
          return
        }
      }
      const id = req.params.id;
      db.prizeConfig.update(req.body, {
        where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Prize was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Prize with id=${id}. Maybe Prize was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Prize with id=" + id
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