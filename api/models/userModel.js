var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var userModelSchema = new Schema({
    username: {type: String, maxLength: 14, required: true, unique: true, dropDups: true },
    createDate: String
})


module.exports = mongoose.model('UserModel', userModelSchema);