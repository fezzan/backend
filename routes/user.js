const express = require('express');
const Router = express.Router();
const db = require("../models");
const { QueryTypes } = require('sequelize');

Router.get("/all", (req, res) => {

  try {
    db.users.findAll()
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        res.statusCode(500).send({
          message:
            err.message || "Some error occured while retrieving Users"
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



// Router.post("/adduser", (req,res)=>{
//     db.users.create({name:req.body.name,age:req.body.age})
//     .then(user=>{
//         res.send(user);
//     })
//     .catch(err => console.log(err))
// });

Router.post("/adduser", (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Please Enter Name"
      });
      return;
    }

    // Create a User
    const user = {
      name: req.body.name,
      age: req.body.age,
      charity_id: req.body.charity_id
    };

    // Save User in the database
    db.users.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
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

// Router.post("/adduser", async (req,res)=>{
//     try{
//         let createdUser = await users.create({
//             name:req.body.name,age:req.body.age
//         }).then(user=>{
//             res.send(user);
//         });
//     if(createdUser){
//         res.json({
//             success: true,
//             message: "User successfully created",
//             aciton: createdUser
//         })
//     } else {
//         res.json({
//             success: false,
//             message: "Failure"
//         })
//     }
// }
// catch (e) {
//     res.json({
//         success: false,
//         message: e.toString(),
//     })
// }


Router.get("/find/:id", (req, res) => {
  try {
    db.users.findAll({
      where: {
        id: req.params.id
      }
    }).then(user => {
      res.send(user)
    }).catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
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



//   Router.delete("/delete/:id", (req, res) => {
//     db.users.destroy({
//       where: {
//         id: req.params.id
//       }
//     }).then(() => {
//         res.send("success")
//     }).catch(err => console.log(err))
//   });

Router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;

    db.users.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
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



//   Router.put("/edit/:id", (req, res) => {
//     db.User.update(
//       {

//       },
//       {
//         where: { id: id }
//       }
//     ).then(() => {
//         res.send("success")
//     }).catch(err => console.log(err))
//   });


Router.put("/edit/:id", (req, res) => {
  try {
    const id = req.params.id;
    db.users.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
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


const TICKET = 1
const EXPERIENCE = 4
Router.post("/entertournament", async (req, res) => {
  try {
    console.log(TICKET)
    let projects = (await db.sequelize.query(`Select SUM (amount) tickets From transactions Where users_id =${req.body.users_id} AND type_typekey=${TICKET}`, { try: QueryTypes.SELECT, model: db.transaction, mapToModel: true }));
    console.log(TICKET)
    let projects1 = projects[0]
    let userTickets = projects1[0].tickets
    let projects2 = (await db.sequelize.query(`Select ticketReq From tournament Where id =${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.tournament, mapToModel: true }));
    let requiredTickets = projects2[0].ticketReq
    if (requiredTickets > userTickets) {
      res.status(500).send({
        success: false,
        message: "You don't have enought tickets to particiapte. You need atleast " + requiredTickets + " to enter this tournament"
      })
    }
    else {
      const t = await db.sequelize.transaction();
      try {
        // Create a Transaction
        const transaction = {
          amount: -parseInt(requiredTickets),
          users_id: req.body.users_id,
          type_typekey: TICKET
        };

        // Save Transaction in the database
        const insertedTransaction = await db.transactions.create(transaction, { transaction: t });
        //---------------------------------------------------------------------------//
        const usertour = {
          users_id: req.body.users_id,
          tournament_id: req.body.tournament_id
        };

        // Save Transaction in the database
        const insertedUserTour = await db.usertournament.create(usertour, { transaction: t });


        const act = {
          description: "This User has entered the tournament " + req.body.tournament_id,
          users_id: req.body.users_id
        };

        // Save Transaction in the database
        const insertedActivity = await db.activity.create(act, { transaction: t });

        const exp = {
          amount: 50,
          users_id: req.body.users_id,
          type_typekey: EXPERIENCE
        }

        // Save Transaction in the database
        const insertedExp = await db.transactions.create(exp, { transaction: t });

        // // Save Category in the database
        // db.category.create(cat)

        await t.commit();
        res.json({
          success: true,
          userTour: insertedUserTour
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
  }
  catch (e) {
    // await t.rollback();
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});

Router.post("/answer", async (req, res) => {
  try {
    let questions = (await db.sequelize.query(`SELECT question.text, question.id,question.answer from question Inner join game on question.game_id = game.id Inner join round on game.round_id = round.id Inner join tournament on tournament_id = tournament.id Inner join usertournament on tournament.id = usertournament.tournament_id where usertournament.users_id = ${req.body.users_id} and usertournament.tournament_id = ${req.body.tournament_id}`, { try: QueryTypes.SELECT, model: db.questions, mapToModel: true }))
    // console.log(questions)
    let oneq = questions[0]
    const t = await db.sequelize.transaction();
    let answers = [];
    try {

      for (let i = 0; i < oneq.length; i++) {
        console.log(oneq[i].id)
        console.log(oneq[i].text)
        // Create a Transaction
        const userans = {
          users_id: req.body.users_id,
          question_id: oneq[i].id,
          answer: 0
        };

        // Save Transaction in the database
        const insertedUserAnswers = await db.useranswer.create(userans, { transaction: t });
        //---------------------------------------------------------------------------//
        answers.push(insertedUserAnswers)

      }
      await t.commit();

    } catch (error) {
      // If the execution reaches this line, an error was thrown.
      // We rollback the transaction.
      await t.rollback();
      res.status(500).json({
        success: false,
        message: "Could not create user answer",
        error: error
      });
    }

    res.json({
      success: true,
      userans: answers
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


Router.get("/answer", async (req, res) => {
  try {
    let correct = (await db.sequelize.query(`SELECT count(*) as Result
    from useranswer Inner join question on useranswer.question_id = question.id 
    Inner Join game on question.game_id = game.id 
    Inner join round on game.round_id = round.id 
    Inner join tournament on tournament_id = tournament.id 
    Inner join usertournament on tournament.id = usertournament.tournament_id 
    Inner Join users on usertournament.users_id = users.id 
    where usertournament.users_id = ${req.body.users_id} and usertournament.tournament_id = ${req.body.tournament_id}
    and useranswer.answer= question.answer group by users.id;`, { try: QueryTypes.SELECT, model: db.useranswer, mapToModel: true }))
    // console.log(questions)

    let answer = correct[0]

    let correctansers = answer[0].Result

    res.status(200).send({
      success: true,
      message: correctansers
    })
  }
  catch (e) {
    // await t.rollback();
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});


Router.get("/leaderboard/:id", async (req, res) => {
  try {
    let correct = (await db.sequelize.query(`SELECT distinct users.id,users.name,count(*) as Score, ROW_NUMBER() OVER  (Order by count(*) desc) as Position 
    from useranswer Inner join question on useranswer.question_id = question.id
    Inner Join game on question.game_id = game.id 
    Inner join round on game.round_id = round.id 
    Inner join tournament on tournament_id = tournament.id 
    Inner join usertournament on tournament.id = usertournament.tournament_id 
    Inner Join users on usertournament.users_id = users.id 
    where (useranswer.answer= question.answer) and (useranswer.users_id = users.id)
    and usertournament.tournament_id = ${req.params.id} group by users.id order by count(*) desc;`, { try: QueryTypes.SELECT, model: db.useranswer, mapToModel: true }))

    res.send(correct)
  }
  catch (e) {
    // await t.rollback();
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});

const PRIZEMONEY = 2
Router.get("/amount", async (req, res) => {
  try {
    let correct = (await db.sequelize.query(`Select u.*,
(IFNULL((Select SUM(AMOUNT) from transactions Where type_typekey = 2 and users_id = u.id),0)) Amount,
(IFNULL((Select SUM(AMOUNT) from transactions Where type_typekey = 4 and users_id = u.id),0)) xp,
IFNULL(u2.name,"No One") 'Invited By',
(
      Select Title from level where (IFNULL((Select SUM(AMOUNT) from transactions Where type_typekey = 4 and users_id = u.id),0)) >= minxp
      Order by minxp desc
      limit 1
) Level
from users u
left join users u2
on u.invitedBy = u2.id;`, { try: QueryTypes.SELECT, model: db.users, mapToModel: true }))
    console.log(correct)

    let answer = correct



    res.json(answer)
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

// SELECT Count(*)+1 as Result
// from xosports.useranswer Inner join xosports.question on useranswer.question_id = question.id 
// Inner Join xosports.game on question.game_id = game.id 
// Inner join xosports.round on game.round_id = round.id 
// Inner join xosports.tournament on tournament_id = tournament.id 
// Inner join xosports.usertournament on tournament.id = usertournament.tournament_id 
// Inner Join xosports.users on usertournament.users_id = users.id 
// where (usertournament.users_id = 5 and usertournament.tournament_id = 3)
// and useranswer.answer= question.answer;

// SELECT distinct users.id,count(*) as Result
//     from xosports.useranswer Inner join xosports.question on useranswer.question_id = question.id 
//     Inner Join xosports.game on question.game_id = game.id 
//     Inner join xosports.round on game.round_id = round.id 
//     Inner join xosports.tournament on tournament_id = tournament.id 
//     Inner join xosports.usertournament on tournament.id = usertournament.tournament_id 
//     Inner Join xosports.users on usertournament.users_id = users.id 
//     where (usertournament.tournament_id = 3
//     and useranswer.answer= question.answer) group by users.id;

// SELECT users.id,count(*) as result FROM xosports.useranswer 
// inner join xosports.question on useranswer.question_id = question.id 
// inner join xosports.users on xosports.useranswer.users_id = users.id 
// where useranswer.answer = question.answer group by users.id;
