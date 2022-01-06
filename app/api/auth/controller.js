const jwt = require('jsonwebtoken')
const bcrypt = require('../../script/helpers/bcrypt')
const jwtSecret = require('../../../config/jwt-secret')
const models = require('../../models/index')

/**
 * Name : create Token
 * @param payload 
 * Output : token
 */
function createToken(payload) {
    return new Promise ((resolve, reject) => {
        jwt.sign(
            { data: payload },
            jwtSecret,
            {
                expiresIn: '1d',
                issuer: 'fairgame.com',
                subject: 'user'
            },
            (err, token) => {
                if (err) throw err
                resolve(token)
            }
        )
    })
}

module.exports = {

    /**
     * Route : ../api/auth/verify
     * Name : Token verify
     * Input : token string
     * Output : if correct => success: true and token , else => success : false
     */
    verify: async(req, res) => {
        console.log("< Token verify started ")
        const {token} = req.body 
        console.log("Token : " + token)
        var check = await jwt.verify(token, jwtSecret)

        if(check) {
            res.json({
                success: true,
                token: token
            })
            console.log("Token verifying success >") 
        } else {
            res.json({
                success: false
            })

            console.log("Token verifying fail >")
        }
    },

    /**
     * Route : ../api/auth/login
     * Name : Login
     * Input : username and password
     * Output : if username and password correct => token and user id in db, else send "success: false"
     * Description : password gets encrypted
     */
    login: async (req, res) => {
        console.log("< Log in attepts ")
        const {username, password} = req.body
        console.log("Username : " + username)

        var user = await models.User.findOne({
            attributes: ['id', 'password'],
            where: {
                username: username
            },
            raw: true
        })
        console.log("User find => " + user!=null)

        var checking = await bcrypt.compareHash(user.password, password)
        console.log("Password checking")
        
        if (checking){
            const token = await createToken({
                type: 'user',
                id: user.id
            })
            
            res.json({
                success: true,
                token: token,
                id: user.id
            })

            console.log("Log in success >")
        } else {
            res.json({
                success: false
            })

            console.log("Log in fail >")
        }

    },

    /**
     * Route : ../api/auth/register
     * Name : register
     * Input : username, password, atk, def
     * Output : create a row in db and send result to client
     * Description : password gets encrypted
     */
    register: async (req, res) => {
        const { username, password, atk, def } = req.body
        const encryptedPW = await bcrypt.generateHash(password);
    

        const checkUsername = await models.User.findOne({
            attributes: ['username'],
            where: {
                username : username
            }
        })

        if (checkUsername!= undefined) {
            res.json({
                success: false
            })
        } else {   
            
            await models.User.create({
                username: username,
                password: encryptedPW,
                atk: parseFloat(atk).toFixed(2),
                def: parseFloat(def).toFixed(2),
                total: ((parseFloat(atk) + parseFloat(def))/parseFloat(2)).toFixed(2)
            })
            
            var {id} = await models.User.findOne({
                where: {
                    username : username
                },
                raw: true
            })

            const token = await createToken({
                type: 'user',
                id: id
            })

            res.json({
                success: true,
                token: token,
                id: id
            })
        }
    },
    
    

}