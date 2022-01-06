module.exports = function(sequelize, DataTypes) {
    const Match = sequelize.define('Match', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        team_a: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        team_b: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        feedbackable : {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })

    Match.getUserMatches = async function(id){
        return await Match.findAll({
            where: {
                [DataTypes.Op.or]: [
                    {
                        team_a : {
                            [DataTypes.Op.substring] : "," + id+","
                        }
                    },
                    {
                        team_b : {
                            [DataTypes.Op.substring] : "," + id+","
                        }
                        
                    }
                ]

            },
            raw: true
        })
    }

    Match.getMatch = async function(id){
        return await Match.findOne({
            where: {
                id : id
            },
            raw: true
        })
    }

    Match.getAbleMathes = async function(date){
        return await Match.findAll({
            attributes: ['id'],
            where: {
                createdAt : {
                    [DataTypes.Op.lt] : date
                },
                feedbackable: true
            },
            raw: true
        })
    }

    return Match
}