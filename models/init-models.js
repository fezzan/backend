var DataTypes = require("sequelize").DataTypes;
var _activity = require("./activity");
var _admin = require("./admin");
var _category = require("./category");
var _charity = require("./charity");
var _customrule = require("./customrule");
var _feed = require("./feed");
var _game = require("./game");
var _gifts = require("./gifts");
var _level = require("./level");
var _prizeConfig = require("./prizeConfig");
var _question = require("./question");
var _rewards = require("./rewards");
var _round = require("./round");
var _rule = require("./rule");
var _sponsor = require("./sponsor");
var _ticket = require("./ticket");
var _tournament = require("./tournament");
var _transactions = require("./transactions");
var _type = require("./type");
var _useranswer = require("./useranswer");
var _users = require("./users");
var _usertournament = require("./usertournament");

function initModels(sequelize) {
  var activity = _activity(sequelize, DataTypes);
  var admin = _admin(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var charity = _charity(sequelize, DataTypes);
  var customrule = _customrule(sequelize, DataTypes);
  var feed = _feed(sequelize, DataTypes);
  var game = _game(sequelize, DataTypes);
  var gifts = _gifts(sequelize, DataTypes);
  var level = _level(sequelize, DataTypes);
  var prizeConfig = _prizeConfig(sequelize, DataTypes);
  var question = _question(sequelize, DataTypes);
  var rewards = _rewards(sequelize, DataTypes);
  var round = _round(sequelize, DataTypes);
  var rule = _rule(sequelize, DataTypes);
  var sponsor = _sponsor(sequelize, DataTypes);
  var ticket = _ticket(sequelize, DataTypes);
  var tournament = _tournament(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var type = _type(sequelize, DataTypes);
  var useranswer = _useranswer(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var usertournament = _usertournament(sequelize, DataTypes);

  question.belongsToMany(users, { as: 'users', through: useranswer, foreignKey: "question_id", otherKey: "users_id" });
  tournament.belongsToMany(users, { as: 'users', through: usertournament, foreignKey: "tournament_id", otherKey: "users_id" });
  users.belongsToMany(question, { as: 'questions', through: useranswer, foreignKey: "users_id", otherKey: "question_id" });
  users.belongsToMany(tournament, { as: 'tournaments', through: usertournament, foreignKey: "users_id", otherKey: "tournament_id" });
  tournament.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(tournament, { as: "tournaments", foreignKey: "category_id"});
  users.belongsTo(charity, { as: "charity", foreignKey: "charity_id"});
  charity.hasMany(users, { as: "users", foreignKey: "charity_id"});
  customrule.belongsTo(game, { as: "game", foreignKey: "game_id"});
  game.hasMany(customrule, { as: "customrules", foreignKey: "game_id"});
  question.belongsTo(game, { as: "game", foreignKey: "game_id"});
  game.hasMany(question, { as: "questions", foreignKey: "game_id"});
  useranswer.belongsTo(question, { as: "question", foreignKey: "question_id"});
  question.hasMany(useranswer, { as: "useranswers", foreignKey: "question_id"});
  game.belongsTo(round, { as: "round", foreignKey: "round_id"});
  round.hasMany(game, { as: "games", foreignKey: "round_id"});
  question.belongsTo(sponsor, { as: "sponsor", foreignKey: "sponsor_id"});
  sponsor.hasMany(question, { as: "questions", foreignKey: "sponsor_id"});
  prizeConfig.belongsTo(tournament, { as: "tournament", foreignKey: "tournament_id"});
  tournament.hasMany(prizeConfig, { as: "prizeConfigs", foreignKey: "tournament_id"});
  round.belongsTo(tournament, { as: "tournament", foreignKey: "tournament_id"});
  tournament.hasMany(round, { as: "rounds", foreignKey: "tournament_id"});
  ticket.belongsTo(tournament, { as: "tournament", foreignKey: "tournament_id"});
  tournament.hasMany(ticket, { as: "tickets", foreignKey: "tournament_id"});
  usertournament.belongsTo(tournament, { as: "tournament", foreignKey: "tournament_id"});
  tournament.hasMany(usertournament, { as: "usertournaments", foreignKey: "tournament_id"});
  transactions.belongsTo(type, { as: "type_typekey_type", foreignKey: "type_typekey"});
  type.hasMany(transactions, { as: "transactions", foreignKey: "type_typekey"});
  activity.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(activity, { as: "activities", foreignKey: "users_id"});
  ticket.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(ticket, { as: "tickets", foreignKey: "users_id"});
  transactions.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(transactions, { as: "transactions", foreignKey: "users_id"});
  useranswer.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(useranswer, { as: "useranswers", foreignKey: "users_id"});
  users.belongsTo(users, { as: "invitedBy_user", foreignKey: "invitedBy"});
  users.hasMany(users, { as: "users", foreignKey: "invitedBy"});
  usertournament.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(usertournament, { as: "usertournaments", foreignKey: "users_id"});

  return {
    activity,
    admin,
    category,
    charity,
    customrule,
    feed,
    game,
    gifts,
    level,
    prizeConfig,
    question,
    rewards,
    round,
    rule,
    sponsor,
    ticket,
    tournament,
    transactions,
    type,
    useranswer,
    users,
    usertournament,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
