const mongoose = require('mongoose');
const ObjectId = require('mongoose').ObjectId;

var mediaSchema = new mongoose.Schema({
    name: { type: String },
    artistId: { type: Number, required: true },
    userType: { type: Number },
    songType: { type: Number },
    filePath: { type: String },
    thumbnailPath: { type: String },
    // user: { type: ObjectId, ref:'User'}
    //author: ObjectId,
});

mongoose.model('songs', mediaSchema);
