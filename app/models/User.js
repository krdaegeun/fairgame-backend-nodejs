/**
 * DB TABLE SCHEMA
 * USER
 * id {Integer, autoincrement}, username {String(16), NOT NULL, UNIQUE}, password {STRING(120), crpyted with bcrypt, NOT NULL}
 * atk {FLOAT}, def {FLOAT}, total {FLOAT}
 * 
 * used: Sequelize (MYSQL) 
 * 
 * 
 * 강한공격 FRage 1 - 5 sehr gut gut mittel starker mittel schwaer ehrlich antworten
 */

const bcrypt = require('../script/helpers/bcrypt')

module.exports = function(sequelize, DataTypes) {
    /**
     * TEST 10.5.2019
     * NAME SCHEMA FOR TABLE
     */
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(16), 
            allowNull: false,
            unique: true,
            validate: {
                is: /^[0-9a-z_]{3,16}$/
            }
        },
        password: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        state: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        atk: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        def: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    })

    User.findByID = async function(id){
        return await User.findOne({
            attributes: ['id', 'username', 'state', 'atk', 'def', 'total'],
            where: {
                id: id
            },
            raw: true
        })
    }

    User.findUsername = async function(id){
        return await User.findOne({
            attributes: ['username'],
            where: {
                id: id
            },
            raw: true
        })
    }

    User.autoComplete = async function(username){
        return await User.findAll({
            attributes: ['id', 'username', 'atk', 'def', 'total'],
            where: {
                username: {
                    [DataTypes.Op.substring]: username
                }
            },
            limit: 20,
            raw: true
        })
    }

    User.checkMyRanking = async function(id, score, state, usersState){
        
        if(state != 0){
            if(state == usersState){
                var mRanking = await User.findAll({
                    attributes: ['id','total'],
                    where: {
                        total : {
                            [DataTypes.Op.gt] : score
                        },
                        state : state,
                        id: {
                            [DataTypes.Op.not]: id
                        }
                    },
                    raw: true
                })
            } else {
                return 0
            }
            
    
        } else{
            var mRanking = await User.findAll({
                attributes: ['id','total'],
                where: {
                    total : {
                        [DataTypes.Op.gt] : score
                    },
                    id: {
                        [DataTypes.Op.not]: id
                    }
                },
                raw: true
            })
        }
        
        if(mRanking != undefined)
            return mRanking.length + 1
        else
            return 1
        
        
    }

    /**
     * TEST 5.6.2019
     * NAME GET PLAYERS FOR TEAMMAKING
     * OUTPUT PLAYERS
     * PURPOSE SELECT WHERE USERNAME =? OR USERNAME =? OR USERNAME=? OR USERNAME=?...
     * 
     * UPDATE 22.6.2019
     * FOR NOT RESTRICTED NUMBER OF PLAYERS
     */

    User.getUsersInfo = async function(ids){
        return await User.findAll({
            attributes: ['id', 'username', 'atk', 'def', 'total'],
            where: {
                id:{
                    [DataTypes.Op.or]: ids
                }
                
            },
            raw:true,
        })
    }

    /**
     * TEST 5.6.2019
     * NAME GET PLAYERS FOR RANKING
     * OUTPUT ORDERED LIST OF PLAYERS 100 ROWS
     * PURPOSE SELECT ORDER BY TOTAL DESC LIMIT 100
     */

    User.ranking = async function(){
        return await User.findAll({
            attributes: {exclude: ['password', 'createdAt', 'updatedAt']},
            order: [['total', 'DESC']],
            limit: 100,
            raw: true
        })
    }

    return User
}