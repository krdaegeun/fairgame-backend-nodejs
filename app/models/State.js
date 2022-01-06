module.exports = function(sequelize, DataTypes) {
    const State = sequelize.define('State', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            unique: true,
            allowNull: false
        }
    })

    

    return State
}