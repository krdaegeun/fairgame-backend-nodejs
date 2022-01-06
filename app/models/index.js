const config = require('../../config/databse')
const UserModel = require('./User')
const FeedbackModel = require('./Feedback')
const MatchModel = require('./Match')
const StateModel = require('./State')
const Sequelize = require('sequelize')

/**
 * TEST 9.5.2019
 * NAME SEQUELIZE CONFIGURATION
 */
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: false
        // pool: {
        //     max: 5,
        //     min: 0
        // }
    }
)

console.log("sequelize starts")

/**
 * TEST 9.5.2019
 * NAME LOAD MODEL EXPORTED MODULE
 */
const User = UserModel(sequelize, Sequelize)
const Match = MatchModel(sequelize, Sequelize)
const Feedback = FeedbackModel(sequelize, Sequelize)
const State = StateModel(sequelize, Sequelize)

//const Feedback = FeedbackModel(sequelize, Sequelize)
//const Match = MatchModel(sequelize, Sequelize)

/**
 * TEST 9.5.2019
 * NAME SEQUERIZE SCHEMA SYNC
 */

sequelize.sync({force: false})
    .catch(err => {
        console.error('An error has occured: ', err);
    }
)

console.log("Sequelize is synchronized")

//console.log(User.findAllUsers())

const db = {User, Match, Feedback, State}
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db;