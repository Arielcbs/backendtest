const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');

const post = async (postInfo) => {
    const newPost = new PostModel({
        postUserId: postInfo.userId,
        postType: postInfo.postType,
        postData:  postInfo.postData,
        createDate: new Date()
    })
    return newPost;
}

const rePost = async (postInfo) =>{
    const newPost = new PostModel({
        postUserId: postInfo.userId,
        postType: postInfo.postType,
        attachedPost: postInfo.attachedPost,
        createDate: new Date()
    })
    return newPost;
}

const quotePost = async (postInfo) => {
    const newPost = new PostModel({
        postUserId: postInfo.userId,
        postType: postInfo.postType,
        postData: postInfo.postData,
        attachedPost: postInfo.attachedPost,
        createDate: new Date()
    })
    return newPost;
}

const createPostValidations = async (req) => {
    // START VALIDATIONS
    if(!req.body){
        return ({status: 400, error: {message: "Post has no body"}});
    }
    if(!req.body.data){
        return ({status: 400, error: {message: "Post has no data object"}});
    }
    if(!req.body.data.postType){
        return ({status: 400, error: {message: "postType field is required"}});
    }
    //If post has no user, it's going to be created as anonymous.
    if(!req.body.data.userId){
        let userId = await UserModel.find({"username": "Anonymous"})
        userId = JSON.parse(JSON.stringify(userId));
        req.body.data.userId = userId[0]._id;
    }else{
        let today = createCustomDate();
        let {findQuery} = queryValidator(1, 6, req.body.data.userId, today, today);
        let userPosts = await PostModel.find(findQuery);
        if(userPosts.length >= 5){
            return ({status: 400, error: {message: "User has reached the limit of 5 posts per day."}});
        }
    }
    if((req.body.data.postType == 'repost' || req.body.data.postType == 'quotepost') && !req.body.data.attachedPost){
        return ({status: 400, error: {message: "Must have attachedPost field for this postType"}});
    }
    if(req.body.data.postType == 'repost' && req.body.data.postData){
        return ({status: 400, error: {message: "Reposts can't have postData"}});
    }
    if((req.body.data.postType == 'post' || req.body.data.postType == 'quotepost') && !req.body.data.postData){
        return ({status: 400, error: {message: "Posts need postData"}});
    }
    if(req.body.data.attachedPost){
        try{
            const data = await PostModel.findById(req.body.data.attachedPost);
            if(req.body.data.postType == 'repost' && data.postType == 'repost'){
                return ({status: 400, error: {message: "Can't repost a repost"}});
            }
            if(req.body.data.postType == 'quotepost' && data.postType == 'quotepost'){
                return ({status: 400, error: {message: "Can't quote-post a quote-post"}});
            }
        }catch(err){
            return ({status: 400, err , error: {message: "attachedPost is not a valid post"}});
        }
    }
    //END VALIDATIONS
    return ({status: 200});
}


const queryValidator = (pageNum, pageSizeOr, userId, dateFrom, dateTo) => {
    let page = pageNum;
    let pageSize = pageSizeOr;
    let findQuery = {};
    //START VALIDATIONS
    if(!page || page == 1){
        page = 0;
    }
    if(userId){
        pageSize = 5;
        findQuery = {postUserId: userId};
    }
    if(dateFrom || dateTo){
        findQuery = {...findQuery, createDate: { $gte: dateFrom ? new Date(`${dateFrom} 00:00:00`) : new Date(), $lte: dateTo ? new Date(`${dateTo} 23:59:59`) : new Date()}}
    }
    //END VALIDATIONS
    return { findQuery, page, pageSize };
}

const createPostBody = async (data) => {
    let newPost;
    if(data.postType == 'post'){
        newPost = await post(data);
    }
    if(data.postType == 'repost'){
        newPost = await rePost(data);
    }
    if(data.postType == 'quotepost'){
        newPost = await quotePost(data);
    }
    return newPost;
}

const fetchFullPosts = async(getPosts) => {
    let posts = await Promise.all(getPosts.map( async (post) =>{
        delete post.__v;
        post.postId = post._id;
        delete post._id;
        if(post.postType === 'repost' || post.postType === 'quotepost'){
            try{
                // let postNumber = post.attachedPost
                let attPost = await PostModel.findById(post.attachedPost);
                attPost = JSON.parse(JSON.stringify(attPost));
                delete attPost.__v;
                attPost.postId = attPost._id;
                delete attPost._id;
                post.attachedPostData = attPost;
            }catch(err){
                post.attachedPost = "Could not find attached Post.";
                //log error here.
            }
        }
        return post;
    }))
    return posts;
    
}

const createCustomDate = () => {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let day = date.getDay();
    let customDate = '';
    if(month+1 <= 10){
        customDate = `${year}-0${month+1}-${day}`;
    }else{
        customDate = `${year}-${month+1}-${day}`;
    }
    return customDate;

}

const createAnonymousUser = async () => {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    let day = date.getDay();
    let checkIfExists = await UserModel.find({"username": "Anonymous"});

    if(checkIfExists.length == 0){
        let anonymous = await UserModel.create({"username": "Anonymous", "createDate": `${month} ${day}, ${year}` });
        console.log("Anonymous user created");
    }
    
}
module.exports = {createPostBody, createPostValidations, queryValidator, fetchFullPosts, createCustomDate, createAnonymousUser };