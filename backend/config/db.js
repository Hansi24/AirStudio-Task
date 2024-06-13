const mongoose = require('mongoose');
require('dotenv').config();

const DbConnection = ()=>{

    mongoose.connect(process.env.MONGO_URI)
    .then((con)=>console.log(`MongoDB is connected to the host :${con.connection.name}`))
    .catch((err)=>{
        console.log(err)
    })

}

module.exports = DbConnection   
