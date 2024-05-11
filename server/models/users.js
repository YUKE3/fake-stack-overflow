var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    reputation: {type: Number, default: 0},
    creation_date : {type: Date, default: Date.now}
})

UserSchema.virtual('url').get(function() {
    return 'posts/user/' + this._id
})

module.exports = mongoose.model('User', UserSchema)