module.exports = function(sequelize, DataTypes) {
    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        matchID: {
            type: DataTypes.INTEGER,
            alloowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            alloowNull: false
        },
        didFeedback: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        atk_up: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        atk_down: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        def_up: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        def_down: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        numOfPlayersMTeam: {
            type: DataTypes.INTEGER,
            alloowNull: false
        },
        numOfPlayersCTeam: {
            type: DataTypes.INTEGER,
            alloowNull: false
        }
    })
    

    return Feedback
}