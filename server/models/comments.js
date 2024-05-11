var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
    text: {type: String, required: true, maxlength: 140},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    time: {type: Date, default: Date.now}
})

CommentSchema.virtual('url').get(function() {
    return 'posts/comments/' + this._id
})

module.exports = mongoose.model('Comment', CommentSchema)