const glpk = require('../../script/helpers/glpk-helper')
const models = require('../../models/index')

module.exports = {

    /**
     * Route : GET ../api/match/team
     * Name : Team create
     * Input : ids, type (number of Teams)
     * Output : Playersinfor with team
     */
    createTeam : async (req, res) => {
        const {id, type} = req.query
        const playersInfo = await models.User.getUsersInfo(id)
        
        console.log(id)
        if(type == 3)
            var result = await glpk.glpk3(playersInfo)
        else 
            var result = await glpk.glpk2(playersInfo)

        res.send(result)
    },

    /**
     * Route : POST ../api/match/add
     * Name : Match instert into db
     * Input : team_a, team_b (ids as a string)
     * Output : void
     */
    add : async (req, res) => {
        var {team_a, team_b} = req.body;
        
        team_a = "," + team_a
        team_b = "," + team_b
        
        var {dataValues} = await models.Match.create({
            team_a : team_a,
            team_b : team_b,
            feedbackable : true
        })

        const matchID = dataValues.id
        
        var players1 = team_a.split(',')
        players1.splice(players1.length - 1, players1.length - 1)
        players1.splice(0, 1)
        var players2 = team_b.split(',')
        
        players2.splice(players2.length - 1, players2.length - 1)
        players2.splice(0, 1)
        var numOfPlayers1 = players1.length
        var numOfPlayers2 = players2.length
        
    
        for(var i = 0 ; i<numOfPlayers1 ; i++){
            await models.Feedback.create({
                matchID: matchID,
                userID: players1[i],
                numOfPlayersMTeam: numOfPlayers1,
                numOfPlayersCTeam: numOfPlayers2
            })
        }

        for(var j = 0 ; j<numOfPlayers2 ; j++){
            await models.Feedback.create({
                matchID: matchID,
                userID: players2[j],
                numOfPlayersMTeam: numOfPlayers2,
                numOfPlayersCTeam: numOfPlayers1
            })
        }        
    
        res.send("1")
    },

    /**
     * Route : GET ../api/match/list
     * Name : get match info from DB for one user
     * Input : User id
     * Output : Matches info
     */
    list : async (req, res) => {
        const {id} = req.query
        const matches = await models.Match.getUserMatches(id)
        
        var matchInfo = []
        var numOfMatches = matches.length
        
       
        for(var i=0 ; i< numOfMatches ; i ++){
            var players = []
            var playersUsernames = ""
            
            
            //players in two teams merge
            var teama = matches[i].team_a.split(',')
            var teamb = matches[i].team_b.split(',')
            teama.splice(teama.length-1, teama.length-1)
            teama.splice(0, 1)
            teamb.splice(teamb.length-1, teamb.length-1)
            teamb.splice(0, 1)
            players = teama.concat(teamb)
            
           
            var feedbackable
            if(matches[i].feedbackable == 1)
                feedbackable = true
            else 
                feedbackable = false
            
            var {didFeedback} = await models.Feedback.findOne({
                attributes: ['didFeedback']
                ,where: {
                    matchID : matches[i].id,
                    userID : id
                },
                raw: true
            })
            

            if(didFeedback == 0)
                feedbackable = true
            else
                feedbackable = false
            
            var numOfPlayers = players.length
            for(var j = 0 ; j<numOfPlayers ; j++){
                
                
                var user = await models.User.findUsername(players[j])

                if(user != undefined){
                    if (playersUsernames != "")
                        playersUsernames += ", " + user.username
                    else
                        playersUsernames += user.username
                }
                
                
            }

            matchInfo.push({ id : matches[i].id , date : matches[i].createdAt, players : playersUsernames, feedbackable : feedbackable})
        }
        
        res.send(matchInfo)
    },

    /**
     * Route : GET ../api/match
     * Name : get Match info
     * Input : matchID, userID
     * Output : match info
     */
    load : async (req, res) => {
        const {matchID, userID} = req.query
        var mTeam;
        var {team_a, team_b} = await models.Match.findOne({
            where: {
                id : matchID
            },
            raw: true
        })
        
        team_a = team_a.split(',')
        team_b = team_b.split(',')
        team_a.splice(team_a.length-1, team_a.length-1)
        team_a.splice(0, 1)
        team_b.splice(team_b.length-1, team_b.length-1)
        team_b.splice(0, 1)

        if(team_a.indexOf(userID) >= 0)
            mTeam = 1
        else
            mTeam = 2

        
        team_a = await models.User.getUsersInfo(team_a)
        team_b = await models.User.getUsersInfo(team_b)

        team_a = await team_a.sort((a,b) => (a.total < b.total) ? 1: -1)
        team_b = await team_b.sort((a,b) => (a.total < b.total) ? 1: -1)
    
        res.json({
            myteam: mTeam,
            teama : team_a,
            teamb : team_b
        })
    },

    /**
     * Route : POST ../api/match/feedback/set
     * Name : send feedback to db
     * Input : feedback data, matchID, targetID (receiver), userID (giver)
     * Output : successness (true or false)
     */
    setFeedback : async (req, res) => {
        const result = req.body
        
        var {feedbackable} = await models.Match.findOne({
            where: {
                id: result[0].matchID
            },
            raw: true
        })

        var {didFeedback} = await models.Feedback.findOne({
            where: {
                matchID: result[0].matchID,
                userID: result[0].giverID
            }

        })
        
        if(feedbackable == 1 && didFeedback == 0){
            await models.Feedback.update(
                {didFeedback: true},
                {where: {
                    matchID: result[0].matchID,
                    userID: result[0].giverID
                }
            })
    
            for (var i = 0 ; i < result.length ; i++){
                if (result[i].value == 0){
                    // 0 feedback
                }else if (result[i].value == -1){
                    // def -1
                    await models.Feedback.increment(
                        'def_down',
                        {where: {
                            matchID: result[i].matchID,
                            userID: result[i].targetID
                        }})
                } else if (result[i].value == -2){
                    // atk -1
                    await models.Feedback.increment(
                        'atk_down',
                        {where: {
                            matchID: result[i].matchID,
                            userID: result[i].targetID
                        }})
                } else if (result[i].value == 1){
                    await models.Feedback.increment(
                        'def_up',
                        {where: {
                            matchID: result[i].matchID,
                            userID: result[i].targetID
                        }})
                } else if (result[i].value == 2){
                    await models.Feedback.increment(
                        'atk_up',
                        {where: {
                            matchID: result[i].matchID,
                            userID: result[i].targetID
                        }})
                }
            }
            
            res.json({
                success: true
            })
        } else {
            res.json({
                success: false
            })
        }
        
    },
    
    

}
