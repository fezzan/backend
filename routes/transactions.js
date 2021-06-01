const express = require('express');
const Router = express.Router();
const db = require("../models");
const { QueryTypes } = require('sequelize');

Router.get("/all", (req, res) => {
  try {
    db.transactions.findAll()
      .then(trans => {
        res.send(trans);
      })
      .catch(err => {
        res.statusCode(500).send({
          message:
            err.message || "Some error occured while retrieving Transactions"
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



Router.post("/addtransaction", (req, res) => {
  try {
    const TICKET = 1
    console.log(TICKET)
    // Validate request
    if (!req.body.amount) {
      res.status(400).send({
        message: "Please Enter amount"
      });
      return;
    }

    // Create a Rule
    const trans = {
      amount: req.body.amount,
      users_id: req.body.users_id,
      type_typekey: TICKET
    };

    // Save Rule in the database
    db.transactions.create(trans)
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
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});

Router.get("/donation/:id", async (req, res) => {
  try {
    let projects
    let donation
    if (req.params.id < 0) {
      projects = (await db.sequelize.query(`SELECT users.name as Username,charity.name as Charity,transactions.amount As "Donated Amount", transactions.createdAt as "Donation Time"  FROM transactions inner join users on users.id = transactions.users_id inner join charity on users.charity_id = charity.id where type_typekey = 2 and amount < 0;`, { try: QueryTypes.SELECT, model: db.transaction, mapToModel: true }));
      donation = projects[0]
      // let cd = ab[0]


    }
    else {
      projects = (await db.sequelize.query(`SELECT users.name as Username,charity.name as Charity,transactions.amount As "Donated Amount", transactions.createdAt as "Donation Time"  FROM transactions inner join users on users.id = transactions.users_id inner join charity on users.charity_id = charity.id where type_typekey = 2 and amount < 0 and users_id=${req.params.id};`, { try: QueryTypes.SELECT, model: db.transaction, mapToModel: true }));
      donation = projects[0]
    }
    res.json([

      ...donation
    ]);
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
    db.transactions.findAll({
      where: {
        id: req.params.id
      }
    }).then(trans => {
      res.send(transtype)
    }).catch(err => {
      res.status(500).send({
        message: "Error retrieving Transaction with id=" + id
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

    db.transactions.destroy({
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
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});


Router.put("/edit/:id", (req, res) => {
  try {
    const id = req.params.id;
    db.transactions.update(req.body, {
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
  catch (e) {
    res.status(500).send({
      success: false,
      message: e.toString()
    })
  }
});



module.exports = Router;