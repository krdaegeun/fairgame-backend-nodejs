const models = require('../../models/index')

module.exports = async function(){

    
    var tendaysago = new Date()
    console.log("db update start : " + tendaysago)
    tendaysago.setDate(tendaysago.getDate() - 10);
    const matches = await models.Match.getAbleMathes(tendaysago)
    
    var numMatches = matches.length
    for(var i=0 ; i<numMatches ; i++){
        
        var feedbacks = await models.Feedback.findAll({
            attributes: ['userID', 'atk_up', 'atk_down', 'def_up', 'def_down', 'numOfPlayersMTeam', 'numOfPlayersCTeam'],
            where: {
                matchID: matches[i].id
            },
            raw: true
        })

        var numFeedbacks = feedbacks.length 
        for(var j=0 ; j<numFeedbacks ; j++){
            
            var feedback = feedbacks[j]
            var atk = 0
            var def = 0
            if (feedback.atk_up >=(feedback.numOfPlayersCTeam /2) )
                atk = 0.2
            else if(feedback.atk_down >=(feedback.numOfPlayersCTeam /2))
                atk = -0.2
            

            if (feedback.def_up >=(feedback.numOfPlayersMTeam /2) )
                def = 0.2
            else if(feedback.def_down >=(feedback.numOfPlayersMTeam /2))
                def = -0.2
                        

            var user = await models.User.findOne({
                attributes : ['atk', 'def'],
                where : {
                    id: feedback.userID
                },
                raw: true
            })

            if (user.atk >= 9.8)
                atk = 0
            else
                atk += user.atk
            
            if (user.def >= 9.8)
                def = 0
            else
                def += user.def

            await models.User.update(
                {atk: atk, def: def, total: ((atk + def)/2).toFixed(2)},
                {where: {
                    id: feedback.userID}
            })

            
        }
        
        await models.Match.update(
            {feedbackable: false},
            {where: {
                id: matches[i].id
            }}
        )


    }

    console.log("db update finished")
}
