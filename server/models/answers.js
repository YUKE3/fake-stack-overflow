var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AnswerSchema = new Schema({
    text: {type: String, required: true},
    ans_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    ans_date_time: {type: Date, default: Date.now},
    upvotes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    downvotes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})

AnswerSchema.virtual('url').get(function() {
    return 'posts/answer/' + this._id
})

module.exports = mongoose.model('Answer', AnswerSchema)