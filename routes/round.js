const express = require('express');
const Router = express.Router();
const db = require("../models");
const { QueryTypes } = require('sequelize');


Router.get("/all", (req, res) => {
  try {
    db.round.findAll()
      .then(myround => {
        res.send(myround);
      })
      .catch(err => {
        res.statusCode(500).send({
          message:
            err.message || "Some error occured while retrieving Rounds"
        })
      });
  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});



Router.post("/addround", async (req, res) => {
  try {
    let projects = (await db.sequelize.query(`Select * From round Where tournament_id =${req.body.tournament_id} ORDER BY roundnumber DESC LIMIT 1`, { try: QueryTypes.SELECT, model: db.round, mapToModel: true }));
    var roundnumber, criteria

    if (projects.length == 0) {
      roundnumber = 1;
      criteria = req.body.criteria
    }
    else {
      roundnumber = projects[0].roundnumber + 1;
      criteria = req.body.criteria
      if (req.body.criteria >= projects[0].criteria) {
        res.status(500).send({
          success: false,
          message: "The Criteria should be less than the previous " + projects[0].criteria
        })
        return
      }
    }

    // Create a Round


    var myround = {
      roundnumber: roundnumber,
      tournament_id: req.body.tournament_id,
      criteria: criteria
    };



    // Save Round in the database
    db.round.create(myround)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Round."
        });
      });
  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});

Router.get("/find/:id", (req, res) => {
  try {
    db.round.findAll({
      where: {
        tournament_id: req.params.id
      }
    }).then(myround => {
      res.send(myround)
    }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Round with id=" + id
      });
    });
  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});



Router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;

    db.round.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Round was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Round with id=${id}. Maybe Round was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Round with id=" + id
        });
      });
  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});


Router.put("/edit/:id", async(req, res) => {
  try {
    let projects = (await db.sequelize.query(`Select roundnumber From round Where id=${req.params.id} AND tournament_id=${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.round, mapToModel: true }));
    let newround = projects[0].roundnumber
    console.log(newround)
    let projects1 = (await db.sequelize.query(`Select criteria From round Where roundnumber=${newround-1} AND tournament_id=${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.round, mapToModel: true }));
    let projects2 = (await db.sequelize.query(`Select criteria From round Where roundnumber=${newround+ 1} AND tournament_id=${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.round, mapToModel: true }));
 

    if(projects1.length==0 && projects2.length!=0){
    
      if(req.body.criteria<=projects2[0].criteria){
        res.status(500).send({
          success: false,
          message: "Current Criteria Should be More than the next Criteria which is: "+projects2[0].criteria
        })
        return
      }
    }
    else if(projects2.length==0 && projects1.length!=0){
      if(req.body.criteria>=projects1[0].criteria){
        res.status(500).send({
          success: false,
          message: "Current Criteria Should be Less than the previous Criteria which is: "+projects1[0].criteria
        })
        return
      }
    }
    else if(projects2.length!=0 && projects1.length!=0){
      if(projects2[0].criteria>=req.body.criteria || projects1[0].criteria<=req.body.criteria){
        res.status(500).send({
          success: false,
          message: "Current Criteria Should be More than the next Criteria and less the previous which is: "+projects2[0].criteria+ " And "+projects1[0].criteria
        })
        return
      }
    }
      
      const id = req.params.id;
      db.round.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Round was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Round with id=${id}. Maybe Round was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Round with id=" + id
        })
      });
    
      }
    
  
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});

Router.put("/activate/:id", async (req, res) => {
  try {
   // db.sequelize.query(`Update round set setActive = 0 where tournament_id =${req.body.tournament_id}`);
    let projects = (await db.sequelize.query(`Select setActive From tournament Where id =${req.body.tournament_id}`,{try: QueryTypes.SELECT,model: db.tournament, mapToModel:true}));
    let projects1 = (await db.sequelize.query(`Select * From round Where id=${req.params.id} AND tournament_id=${req.body.tournament_id}`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
    let projects2
    let projects3 = (await db.sequelize.query(`Select roundnumber From round Where tournament_id=${req.body.tournament_id} And setActive=1`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
    let projects4 = (await db.sequelize.query(`Select * From round Where tournament_id=${req.body.tournament_id} AND setActive=1 AND roundnumber>${projects1[0].roundnumber}`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}))
    //console.log(projects1[0].roundnumber)
    //let nextround = projects1[0].roundnumber+1
    //let projects4 = (await db.sequelize.query(`Select setActive From round Where roundnumber=${nextround} AND tournament_id=${req.body.tournament_id}`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
   
   //console.log(projects4[0].setActive)
  

     if (projects.length == 0) {
      res.status(400).send({
        message: "Round cannot be acitvated tournament with id " + req.body.tournament_id + " doesn't exist"
      })
      return
    }
    else if (projects[0].setActive > 1) {
      res.status(400).send({
        success: false,
        message: "Bit can be true/false or 0/1"
      })
      return
    }
    else if (projects[0].setActive != 1) {
      res.status(400).send({
        success: false,
        message: "Tournament is not Active"
      })
      return
    }
    else if (projects1.length == 0) {
      res.status(400).send({
        success: false,
        message: "Round with id " +req.params.id+ " doesn't exist"
      })
      return
    }
    else if(projects1[0].setActive==1){
      res.status(400).send({
        success: false,
        message: "This round is already Active"
      })
      return
    }
    else if(projects4.length!=0){
      projects3 = (await db.sequelize.query(`Select roundnumber From round Where tournament_id=${req.body.tournament_id} And setActive=1`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
      res.status(400).send({
        success: false,
        message: "This round has already been played, current active round is "+projects3[0].roundnumber
      })
      return
    }
    else {
      console.log("hi")
      if((projects1[0].roundnumber == 1 || projects1[0].roundnumber > 1) && projects4.length!=0){
        res.status(400).send({
          success: false,
          message: "Cannot activate this round because you have already played this round. Latest active round is "+projects3[0].roundnumber
        })
        return
      }
      else if(projects1[0].roundnumber == 1){
       // db.sequelize.query(`Update round set setActive = 0 where tournament_id =${req.body.tournament_id}`);
        db.sequelize.query(`Update round set setActive = 1 where id =${req.params.id} AND tournament_id =${req.body.tournament_id}`);
        res.send({
          message: "Round Activated"
        })
      }
      else if(projects1[0].roundnumber > 1){
        var prevroundnumber = projects1[0].roundnumber-1
        projects2 = (await db.sequelize.query(`Select * From round Where tournament_id=${req.body.tournament_id} AND roundnumber=${prevroundnumber}`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}))
        if(projects2[0].setActive!=0){
          res.status(400).send({
            success: false,
            message: "Cannot activate this round because you haven't played the previous round"
          })
          return
        }
        else{
         // db.sequelize.query(`Update round set setActive = 0 where tournament_id =${req.body.tournament_id}`);
        db.sequelize.query(`Update round set setActive = 1 where id =${req.params.id} AND tournament_id =${req.body.tournament_id}`);
        res.send({
          message: "Round Activated"
        })
        }
      }
     
    }
  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});


Router.get("/questions/:id", async (req, res) => {
  try {
   let questions = (await db.sequelize.query(`SELECT question.id,question.text FROM question inner join game on question.game_id = game.id
   inner join round on game.round_id = round.id where round.id = ${req.params.id};`,{try: QueryTypes.SELECT,model: db.question, mapToModel:true}));
   console.log(questions[0])
   
     res.send(questions)
   

  }
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});


Router.put("/end/:id", async (req, res) => {
  try {
    let questions = (await db.sequelize.query(`SELECT * FROM question inner join game on question.game_id = game.id
    inner join round on game.round_id = round.id where round.id = ${req.params.id};`,{try: QueryTypes.SELECT,model: db.question, mapToModel:true}));
    if(questions.length==0){
      res.status(500).send({
        success: false,
        message: "Cannot End Round With No Questions"
      })
    }
    let oneq = req.body;
    console.log(req.body);
    let answers = [];
    const t = await db.sequelize.transaction();
    try {

      for (let i = 0; i < oneq.length; i++) {
        console.log(oneq[i].id)
        console.log(oneq[i].answer)
        // Create a Transaction
        const adminans = {
          answer: oneq[i].answer
        };

        // Save Transaction in the database
        
        const insertedAmindAnswers = await db.question.update(adminans, {
          where: { id: oneq[i].id }
        }, { transaction: t });
        //---------------------------------------------------------------------------//
        answers.push(insertedAmindAnswers);
        
      }
      await db.sequelize.query(`Update round set setActive = 0 where round.id =${req.params.id}`);
      await t.commit();

    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Could not Update Admin answer",
        error: error
      });
    }

    res.json({
      success: true,
      adminans: answers
    });
  }
  catch (e) {
    // await t.rollback();
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});



module.exports = Router;