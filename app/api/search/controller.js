const UserDB = require('../../models/index').User
const StateDB = require('../../models/index').State
const MatchDB = require('../../models/index').Match
module.exports = {
    
    /**
     * Name : get user by ID
     * Input : ID
     * Output : user information without password
     */
    user : async (req, res) => {
        const {id} = req.query
        const user = await UserDB.findByID(id)
        res.send(user)
    },

    /**
     * Name : get users by username for autocomplete search query
     * Input : username
     * Output : users who have this username in username
     */
    autocomplete : async (req, res) => {
        const {q} = req.query
        console.log(q)
        const autocomplete = await UserDB.autoComplete(q)
        res.send(autocomplete)
    },

    ranking : async (req, res) => {
        const {state} = req.query

        if(state == 0){
            var ranking = await UserDB.findAll({
                attributes: ['id', 'username', 'total'],
                order: [['total', 'DESC']],
                limit: 300,
                raw: true
            });
        } else {
            var ranking = await UserDB.findAll({
                attributes: ['id', 'username', 'total'],
                where:{
                    state : state
                },
                order: [['total', 'DESC']],
                limit: 300,
                raw: true
            });
        }
        

        res.send(ranking)
    },

    // Route : ../api/search/ranking/me
    mRanking : async (req, res) => {
        const {id, state} = req.query

        const user = await UserDB.findByID(id)
        const mRanking = await UserDB.checkMyRanking(id, user.total, state, user.state)


        res.json({
            username: user.username,
            total: user.total,
            ranking: mRanking
        })
    },

    /**
     * Route : ../api/search/ranking/state
     * Name : get states from DB
     * Input : void
     * Output : states list
     */
    state: async (req, res) => {
        
        const states = await StateDB.findAll({
            attributes: ['id', 'name'],
            raw: true
        })
        res.send(states)
    }
}