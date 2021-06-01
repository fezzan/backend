const express = require("express");
const formData = require("express-form-data");
const cors = require("cors")

const jwt = require("jsonwebtoken");

var app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

var bcrypt = require('bcrypt')
var saltRouds = 10


// app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'))
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(formData.parse(options));

// db.sequelize.sync().then(()=>{
//     app.listen(PORT, ()=>{
//         console.log(`Connected!`);
//     });
// });

app.listen(PORT, () => {
    console.log(`Connected!`);
});

//const mysqlConnection = require("./connection");


app.post("/signin", async (req, res) => {
    try{
    var user = {};
    user.email = req.body.email;
    user.password = req.body.password;


    let findAdmin = await db.admin.findOne({
        where: {
            email: req.body.email
        }
    });
    console.log(findAdmin);
    if (findAdmin == null) {
        res.status(500).send({
            message: "Admin Does Notexists..."
        })
    }
     else {
        if (bcrypt.compareSync(user.password,findAdmin.password)) {
            let token = jwt.sign({ user: user }, 'abcdefghijklmnopqrstuvwxyz');
            res.status(200).json({
                token,
                user: findAdmin
            })

        } else {
            res.send("User Unauthorized Access");
        }
    }
}
catch (ex) {
    res.status(500).send({
        success: false,
        message: ex.toString()
    })
}
        });



app.post("/signup", async (req, res) => {
    try {
        // Validate request
        if (!req.body.email) {
            res.status(400).send({
                message: "Please Enter Username"
            });
            return;
        }
        else if (!req.body.password) {
            res.status(400).send({
                message: "Please Enter Password"
            })
        }
        // Create a Category
        const credentials = {
            email: req.body.email,
            password: req.body.password
        };
        let findAdmin = await db.admin.findOne({
            where: {
                email: req.body.email
            }
        });
        if (findAdmin != null) {
            res.status(500).send({
                message: "User already exists..."
            })
        }
        else {
            let hash = await bcrypt.hash(credentials.password, saltRouds)
            console.log("else")
            credentials.password = hash
            let admin = await db.admin.create(credentials);
            console.log(admin);
            let token = jwt.sign({ user: admin }, 'abcdefghijklmnopqrstuvwxyz');
            res.json({
                success: true,
                token
            });

        }
    }
    catch (ex) {
        res.status(500).send({
            success: false,
            message: ex.toString()
        })
    }
});

const authenticateMiddleware = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined 

    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middlware
        jwt.verify(req.token, "abcdefghijklmnopqrstuvwxyz", (err, authData) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
            } else {
                next();
            }
        });
    }
    else {
        res.sendStatus(403);
    }

}



const UserRoutes = require("./routes/user");
const CharityRoutes = require("./routes/charity");
const CustomRuleRoutes = require("./routes/customrule");
const FeedRoutes = require("./routes/feed");
const GameRoutes = require("./routes/game");
const GiftsRoutes = require("./routes/gifts");
const QuestionRoutes = require("./routes/question");
const RewardsRoutes = require("./routes/rewards");
const RoundRoutes = require("./routes/round");
const RuleRoutes = require("./routes/rule");
const SponsorRoutes = require("./routes/sponsor");
const TicketRoutes = require("./routes/ticket");
const TournamentRoutes = require("./routes/tournament");
const PrizeConfigRoutes = require("./routes/prizeConfig");
const CategoryRoutes = require("./routes/category");
const TypeRoutes = require("./routes/type");
const TransactionsRoutes = require("./routes/transactions");
const UserTournamentRoutes = require("./routes/usertournament");
const UserAnswerRoutes = require("./routes/useranswer");
const AdminRoutes = require("./routes/admin");
const ActivityRoutes = require("./routes/activity");
const LevelRoutes = require("./routes/level");
//app.use(bodyParser.json());

app.use("/user", authenticateMiddleware, UserRoutes)
app.use("/charity", authenticateMiddleware, CharityRoutes)
app.use("/customrule", authenticateMiddleware, CustomRuleRoutes)
app.use("/feed", authenticateMiddleware, FeedRoutes)
app.use("/game", authenticateMiddleware, GameRoutes)
app.use("/gifts", authenticateMiddleware, GiftsRoutes)
app.use("/question", authenticateMiddleware, QuestionRoutes)
app.use("/rewards", authenticateMiddleware, RewardsRoutes)
app.use("/round", authenticateMiddleware, RoundRoutes)
app.use("/rule", authenticateMiddleware, RuleRoutes)
app.use("/sponsor", authenticateMiddleware, SponsorRoutes)
app.use("/ticket", authenticateMiddleware, TicketRoutes)
app.use("/tournament", authenticateMiddleware, TournamentRoutes)
app.use("/prizeConfig", authenticateMiddleware, PrizeConfigRoutes)
app.use("/category", authenticateMiddleware, CategoryRoutes)
app.use("/type", authenticateMiddleware, TypeRoutes)
app.use("/transactions", authenticateMiddleware, TransactionsRoutes)
app.use("/usertournament", authenticateMiddleware, UserTournamentRoutes)
app.use("/useranswer", authenticateMiddleware, UserAnswerRoutes)
app.use("/admin", authenticateMiddleware, AdminRoutes)
app.use("/activity", authenticateMiddleware, ActivityRoutes)
app.use("/level",authenticateMiddleware, LevelRoutes)



// app.listen(3000);

// 160.119.254.32

//sequelize-auto -o "./models" -d xosports -h 160.119.254.32 -u root -p 3306 -x malik200 -e mysql