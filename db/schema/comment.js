var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var ObjectId = require('mongoose').ObjectId;


var commentSchema = new mongoose.Schema({
    userId: { type: Number },
    mediaId: { type: ObjectId },
    comment: { type: String } 
});

mongoose.set('useCreateIndex', true); // for remove (node:11052) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
autoIncrement.initialize(mongoose.connection);

commentSchema.plugin(autoIncrement.plugin, 'comment');
mongoose.model('comment', commentSchema);