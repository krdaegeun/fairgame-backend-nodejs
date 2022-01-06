const models = require('../../models/index')

var app = async function(){
    var tendaysago = new Date()
    tendaysago.setDate(tendaysago.getDate() - 1);
    console.log(tendaysago) 

    const matches = await models.Match.getAbleMathes(tendaysago)

    console.log(matches.length)
}

app()