const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = require('./userModel');
const PostModel = require('./postModel');


var postModelSchema = new Schema({
    postUserId: {type: Schema.Types.ObjectId, ref:UserModel, required: true},
    postType: {type: String, enum:['post', 'repost', 'quotepost'], required: true},
    attachedPost: String,
    postData: {type: String, maxLength: 777},
    createDate: Date
})


module.exports = mongoose.model('PostModel', postModelSchema);