const Sequelize=require("sequelize")

const db=new Sequelize('windad', 'postgres', 'drowssap',{
    host:"localhost",
    dialect:"postgres"
})

module.exports = db;