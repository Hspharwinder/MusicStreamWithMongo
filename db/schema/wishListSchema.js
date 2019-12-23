var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var ObjectId = require('mongoose').ObjectId;

var wishListSchema = new mongoose.Schema({
    userId: { type: Number },
    mediaId: { type: ObjectId },
});

mongoose.set('useCreateIndex', true); // for remove (node:11052) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
autoIncrement.initialize(mongoose.connection);

wishListSchema.plugin(autoIncrement.plugin, 'wishList');
mongoose.model('wishList', wishListSchema);