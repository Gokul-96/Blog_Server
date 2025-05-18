const mongoose = require("mongoose");

const DB = async () => {
try {
    await mongoose.connect(process.env.Mongodb)
    console.log('DB Connected')

}catch(error){
    console.error('DB connection failed:', error.message)
process.exit(1);
};

}
module.exports = DB;