var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var ObjectId = require('mongoose').ObjectId;

var likeSchema = new mongoose.Schema({
    userId: { type: Number },
    mediaId: { type: ObjectId },
    like: { type: Number } // 0 like, 1 dislike
});

mongoose.set('useCreateIndex', true); // for remove (node:11052) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
autoIncrement.initialize(mongoose.connection);

likeSchema.plugin(autoIncrement.plugin, 'like');
mongoose.model('like', likeSchema);