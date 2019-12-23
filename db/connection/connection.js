const mongoose = require('mongoose');
require("dotenv").config;
// require("dotenv/config");

require('../schema/userSchema');
require('../schema/mediaSchema');
require('../schema/comment');
require('../schema/likingSchema');
require('../schema/wishListSchema');

const uri = 'mongodb://127.0.0.1:27017/MongoQuery'; // process.env.MONGOURL;
//  useNewUrlParser: true, useUnifiedTopology: true for removing depricating warning
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log(uri);
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

//  module.exports = mySqlCon;