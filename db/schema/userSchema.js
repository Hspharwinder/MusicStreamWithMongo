var mongoose = require('mongoose');
//, Schema = mongoose.Schema, 
var autoIncrement = require('mongoose-auto-increment');
//var ObjectId = require('mongoose').ObjectId;

var userSchema = new mongoose.Schema({
    name: { type: String  },  
    password: { type: String },  
    email: { type: String, unique: true, required: 'This field is required.' },
    userType: { type: Number },  
    userImage: { type: String },   
    status: { type: Number },  
    mobileNo: { type: Number },   
    description: { type: String },  
    userName: { type: String, unique:true },
    // songs: [{ type: ObjectId, ref: 'Songs'}]
    //author: ObjectId,
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.set('useCreateIndex', true);  // for remove (node:11052) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, 'user');
mongoose.model('user', userSchema);