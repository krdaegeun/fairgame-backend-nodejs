const models = require('../../models/index')
const bcrypt = require('../../script/helpers/bcrypt')

module.exports = {
    state: async(req, res) => {
        const request = req.body

        await models.User.update(
            {state: request.state},
            {where: {
                id: request.id
            }
        })

        res.send("1")
    },

    username: async(req, res) => {
        const request = req.body
        
        var usernameCheck = await models.User.findOne({
            attributes: ['username'],
            where: {
                username: request.username
            },
            raw: true
        })

        if (usernameCheck == undefined){
            await models.User.update(
                {username: request.username},
                {where: {
                    id: request.id
                }
            })

            res.json({
                success: true
            })
        } else{
            res.json({
                success: false
            })
        }   
        

        
    },

    password: async(req, res) => {
        const request = req.body

        var user = await models.User.findOne({
            attributes: ['password'],
            where: {
                id: request.id
            },
            raw: true
        })

        var checking = await bcrypt.compareHash(user.password, request.password)

        if(checking){

            const encrpytedPW = await bcrypt.generateHash(request.newPassword)

            await models.User.update(
                {password: encrpytedPW},
                {where: {
                    id: request.id
                }
            })

            res.json({
                success: true
            })
        } else {
            res.json({
                success: false
            })
        }

    }
}