const express = require('express');
const Router = express.Router();
const db = require("../models");
const { upload } = require('../common/multer');
const { QueryTypes } = require('sequelize');

Router.get("/all", (req,res)=>{
    try{
    db.tournament.findAll()
    .then(mytournament=>{
        res.send(mytournament);
    })
    .catch(err => {
        res.statusCode(500).send({
            message:
            err.message || "Some error occured while retrieving Tournaments"
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



Router.post("/addtournament",upload.single("picture"), (req, res) => {
    try{
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter name of the Tournament"
      });
      return;
    }
  
    // Create a Tournament
    const mytournament = {
      name: req.body.name,
      picture: req.file.filename,
      category_id: req.body.category_id,
      startsOn: req.body.startsOn,
      ticketReq: req.body.ticketReq,

    };
  
    // Save Tournament in the database
    db.tournament.create(mytournament)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tournament."
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
    db.tournament.findAll({
      where: {
        id: req.params.id
      }
    }).then(mytournament =>{
        res.send(mytournament)
    }).catch(err => {
        res.status(500).send({
          message: "Error retrieving Tournament with id=" + id
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
  
    db.tournament.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tournament was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Tournament with id=${id}. Maybe tournament was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete tournament with id=" + id
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
          startsOn: req.body.startsOn,
          ticketReq: req.body.ticketReq,
          category_id: req.body.category_id,
          setActive: req.body.setActive,
        };
        if (req.file){
          req.body.picture=req.file.filename
          updateObj.picture = req.file.filename
        }
    const id = req.params.id;
    db.tournament.update(updateObj, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tournament was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Tournament with id=${id}. Maybe tournament was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating tournament with id=" + id
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


  Router.put("/activate/:id",async (req, res) => {
    try{
      let projects = (await db.sequelize.query(`Select setActive From tournament Where id =${req.params.id}`,{try: QueryTypes.SELECT,model: db.tournament, mapToModel:true}));
      if (projects[0].setActive>1){
          res.status(400).send({
            success: false,
            message: "Bit can be true/false or 0/1"
          })
          return
        }
        else if(projects[0].setActive==null){
          db.sequelize.query(`Update tournament set setActive = 1 where id =${req.params.id}`)
          res.send({
            success: true,
            message: "Tournament Sucessfully Activated"
          })
          return
        }
        else if(projects[0].setActive==1){
          res.status(400).send({
            success: false,
            message: "Tournament already Active"
          })
          return
        }
        else if(projects[0].setActive==0){
          res.status(400).send({
            success: false,
            message: "Cannot Activate Ended Tournament"
          })
          return
        }
  }
  catch(e){
      res.status(500).send({
          success: false,
          message: e.toString()
      })
  }
});

Router.put("/end/:id",async (req, res) => {
  try{
    const PRIZEMONEY = 2
    const EXPERIENCE = 4
    let onecom = 0
    let twocom = 0
    let threecom = 0
    let projects = (await db.sequelize.query(`Select setActive From round Where tournament_id =${req.params.id} ORDER BY roundnumber DESC LIMIT 1`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
    let roundnull = (await db.sequelize.query(`Select setActive From round Where tournament_id =${req.params.id} and setActive is null;`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}));
    let endcheck = (await db.sequelize.query(`SELECT question.text, game.gamename, round.roundnumber, round.id, tournament.id from question Inner join game on question.game_id = game.id Inner join round on game.round_id = round.id Inner join tournament on tournament_id = tournament.id where question.answer is null and tournament.id = ${req.params.id}`,{try: QueryTypes.SELECT,model: db.round, mapToModel:true}))
    console.log(endcheck.length)
    if(roundnull.length>0){
      res.status(400).send({
        success: false,
        message: "Tournament cannot end because some rounds haven't been played yet"
      })
      return
    }
    else if(projects[0].setActive==1){
      res.status(400).send({
        success: false,
        message: "Tournament cannot end because the last round hasn't ended yet"
      })
      return
    }
   
    else if(endcheck.length>0){
      res.status(500).send({
        success : false,
        message : "Cannnot End Tournament Because all the questions haven't been answered"
      })
      return
    }
    else{
      let leaderboard = (await db.sequelize.query(`WITH Leaderboard as (SELECT distinct users.id as uid,users.name,count(*) as Score,tournament.id as tournament, ROW_NUMBER() OVER  (Order by count(*) desc) as Position
        from useranswer Inner join question on useranswer.question_id = question.id
        Inner Join game on question.game_id = game.id 
        Inner join round on game.round_id = round.id 
        Inner join tournament on tournament_id = tournament.id 
        Inner join usertournament on tournament.id = usertournament.tournament_id 
        Inner Join users on usertournament.users_id = users.id 
        where (useranswer.answer= question.answer) and (useranswer.users_id = users.id) 
        and usertournament.tournament_id = ${req.params.id}  group by users.id order by count(*) desc)
        Select * from Leaderboard L inner join prizeConfig PC on PC.tournament_id = tournament where PC.${'`'}Rank${'`'} = L.Position;`,{try:QueryTypes.SELECT,model:db.useranswer,mapToModel: true }))
       //.log(leaderboard)
        //console.log(leaderboard.length)
        let invites
        const t = await db.sequelize.transaction();
        try {

    for(let i=0;i<leaderboard.length;i++){
 
      let lboard = leaderboard[i].dataValues.uid
      let prizes = leaderboard[i].dataValues.prize
      let experience = leaderboard[i].dataValues.xp

      console.log(prizes)
      console.log(experience)
    

    //console.log(lboard)

    invites = (await db.sequelize.query(`Select u1.*, u2.id as user2, u3.id as user3, u4.id as user4 from users u1 
    left join users u2 on u1.invitedBy = u2.id 
    left join users u3 on u2.invitedBy = u3.id
    left join users u4 on u3.invitedBy = u4.id where u1.id = ${lboard};`,{try:QueryTypes.SELECT,model:db.users,mapToModel: true }))
    let invited = invites[0]
    console.log(invited.dataValues.id +" Me")
    console.log(invited.dataValues.user2+" Above me")
    console.log(invited.dataValues.user3+ "Above Above Me")
    console.log(invited.dataValues.user4+ "Above Above Above Me")
    
    
    if(invited.dataValues.user2==null){
      console.log("1st If")
      prizes = prizes-0
      console.log(prizes+" Me Prize")
      // Declare Transaction1
      const transaction1 = {
        amount: prizes,
        users_id: invited.dataValues.id,
        type_typekey: PRIZEMONEY
      };
      // Save Transaction1 in the database
      const insertedTransaction1 = await db.transactions.create(transaction1, { transaction: t });
      //---------------------------------------------------------------------------//
    }
    else if(invited.dataValues.user3==null){
      console.log("2nd If")
      onecom = prizes * 0.05
      prizes = prizes - onecom 
      console.log(onecom+" Above Me Prize")
      console.log(prizes+" Me Prize")
       // Create a Transaction
       const transaction2 = {
        amount: onecom,
        users_id: invited.dataValues.user2,
        type_typekey: PRIZEMONEY
      };
      const transaction1 = {
        amount: prizes,
        users_id: invited.dataValues.id,
        type_typekey: PRIZEMONEY
      };
      // Save Transaction2 in the database
      const insertedTransaction2 = await db.transactions.create(transaction2, { transaction: t });
      //---------------------------------------------------------------------------//
      // Save Transaction1 in the database
      const insertedTransaction1 = await db.transactions.create(transaction1, { transaction: t });
      
    }
    else if(invited.dataValues.user4==null){
      console.log("3rd If")
      onecom = prizes * 0.05
      twocom = prizes * 0.03
      prizes = prizes - onecom - twocom
      console.log(onecom+" Above Me Prize")
      console.log(twocom+" Above Above Me Prize")
      console.log(prizes+" Me Prize")
      const transaction3 = {
        amount: twocom,
        users_id: invited.dataValues.user3,
        type_typekey: PRIZEMONEY
      };
      const transaction2 = {
        amount: onecom,
        users_id: invited.dataValues.user2,
        type_typekey: PRIZEMONEY
      };
      const transaction1 = {
        amount: prizes,
        users_id: invited.dataValues.id,
        type_typekey: PRIZEMONEY
      };
      // Save Transaction3 in the database
      const insertedTransaction3 = await db.transactions.create(transaction3, { transaction: t });
      //---------------------------------------------------------------------------//
       // Save Transaction2 in the database
       const insertedTransaction2 = await db.transactions.create(transaction2, { transaction: t });
       //---------------------------------------------------------------------------//
       // Save Transaction1 in the database
       const insertedTransaction1 = await db.transactions.create(transaction1, { transaction: t });
       
    }
    else{
      console.log("Else")
      onecom = prizes * 0.05
      twocom = prizes * 0.03
      threecom = prizes * 0.02
      prizes = prizes - onecom - twocom - threecom
      console.log(onecom+" Above Me Prize")
      console.log(twocom+" Above Above Me Prize")
      console.log(threecom+" Above Above Above Me Prize")
      console.log(prizes+" Me Prize")
      const transaction4 = {
        amount: threecom,
        users_id: invited.dataValues.user4,
        type_typekey: PRIZEMONEY
      };
      const transaction3 = {
        amount: twocom,
        users_id: invited.dataValues.user3,
        type_typekey: PRIZEMONEY
      };
      const transaction2 = {
        amount: onecom,
        users_id: invited.dataValues.user2,
        type_typekey: PRIZEMONEY
      };
      const transaction1 = {
        amount: prizes,
        users_id: invited.dataValues.id,
        type_typekey: PRIZEMONEY
      };
      // Save Transaction4 in the database
      const insertedTransaction4 = await db.transactions.create(transaction4, { transaction: t });
      //---------------------------------------------------------------------------//
      // Save Transaction3 in the database
      const insertedTransaction3 = await db.transactions.create(transaction3, { transaction: t });
      //---------------------------------------------------------------------------//
       // Save Transaction2 in the database
       const insertedTransaction2 = await db.transactions.create(transaction2, { transaction: t });
       //---------------------------------------------------------------------------//
       // Save Transaction1 in the database
       const insertedTransaction1 = await db.transactions.create(transaction1, { transaction: t });



      

    }
    console.log("Out of IF ELSE")
    console.log(prizes+" Me Prize")
    const act1 = {
      description: "The user has won the Prize of "+prizes,
      users_id: invited.dataValues.id
    }
    const act2 = {
      description: "The user has secured the position "+ (parseInt(i)+1),
      users_id: invited.dataValues.id
    }
    console.log(act1,act2)
    // Save Transaction in the database
   
     const insertedActivity2 = await db.activity.create(act2, { transaction: t });

      // Save Transaction in the database
     const insertedActivity1 = await db.activity.create(act1, { transaction: t });

     const exp = {
       amount: experience,
       users_id: invited.dataValues.id,
        type_typekey: EXPERIENCE
     }

     const insertedExp = await db.transactions.create(exp, { transaction: t });

     const act3 = {
      description: "The user has gained an Experience of "+experience,
      users_id: invited.dataValues.id
    }
    const insertedActivity3 = await db.activity.create(act3, { transaction: t });
    

     
    }
    const endtournament = await db.sequelize.query(`Update tournament set setActive = 0 where id =${req.params.id}`)

  
    await t.commit();
    res.json({
      success: true,
      message: "Transactions Added And Tournament Ended"
    });
    }
    catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      res.status(500).json({
        success: false,
        message: "Could not add Transactions And End Tournament",
        error: error
      });
    }
    }    
}
catch(e){
    res.status(500).send({
        success: false,
        message: e.toString()
    })
}
});

Router.get("/winners/:id", async (req,res)=>{
  try{
    let leaderboard = (await db.sequelize.query(`WITH Leaderboard as (SELECT distinct users.id as uid,users.name,count(*) as Score,tournament.id as tournament, ROW_NUMBER() OVER  (Order by count(*) desc) as Position
        from useranswer Inner join question on useranswer.question_id = question.id
        Inner Join game on question.game_id = game.id 
        Inner join round on game.round_id = round.id 
        Inner join tournament on tournament_id = tournament.id 
        Inner join usertournament on tournament.id = usertournament.tournament_id 
        Inner Join users on usertournament.users_id = users.id 
        where (useranswer.answer= question.answer) and (useranswer.users_id = users.id) 
        and usertournament.tournament_id = ${req.params.id}  group by users.id order by count(*) desc)
        Select * from Leaderboard L inner join prizeConfig PC on PC.tournament_id = tournament where PC.${'`'}Rank${'`'} = L.Position;`,{try:QueryTypes.SELECT,model:db.useranswer,mapToModel: true }))
        res.json(leaderboard)
}
catch(e){
  res.status(500).send({
      success: false,
      message: e.toString()
  })
}
});
  


module.exports = Router;

//SELECT xosports.question.text, xosports.game.gamename, xosports.round.roundnumber, xosports.round.id, xosports.tournament.id from xosports.question Inner join xosports.game on question.game_id = game.id Inner join xosports.round on game.round_id = round.id Inner join xosports.tournament on round.tournament_id = tournament.id where question.answer is null


// WITH Leaderboard as (SELECT distinct users.id,users.name,count(*) as Score,tournament.id as tournament, ROW_NUMBER() OVER  (Order by count(*) desc) as Position
//     from xosports_prod.useranswer Inner join xosports_prod.question on useranswer.question_id = question.id
//     Inner Join xosports_prod.game on question.game_id = game.id 
//     Inner join xosports_prod.round on game.round_id = round.id 
//     Inner join xosports_prod.tournament on tournament_id = tournament.id 
//     Inner join xosports_prod.usertournament on tournament.id = usertournament.tournament_id 
//     Inner Join xosports_prod.users on usertournament.users_id = users.id 
//     where (useranswer.answer= question.answer) and (useranswer.users_id = users.id) 
//     and usertournament.tournament_id = 15  group by users.id order by count(*) desc)
//     Select * from Leaderboard L inner join xosports_prod.prizeConfig PC on PC.tournament_id = tournament where PC.`Rank` = L.Position;
    
    
// Select u1.*, u2.id as user2, u3.id as user3, u4.id as user4 from xosports.users u1 
// left join xosports.users u2 on u1.invitedBy = u2.id 
// left join xosports.users u3 on u2.invitedBy = u3.id
// left join xosports.users u4 on u3.invitedBy = u4.id where u1.id = 5;