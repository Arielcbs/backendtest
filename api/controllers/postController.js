const PostModel = require('../models/postModel');
const UserModel = require('../models/userModel');
const { createPostBody, createPostValidations, queryValidator, fetchFullPosts } = require('../helpers/helpers');

exports.listPosts = async (req, res) => {
    const dateFrom = req.query['date-from'];
    const dateTo = req.query['date-to'];
    const userId = req.query['user-id'];
    let pageSizeOr = 10;
    let pageNum = req.query['page'];
    let { findQuery, page, pageSize } = queryValidator(pageNum, pageSizeOr, userId, dateFrom, dateTo);

    try{
        let getPosts = await PostModel.find(findQuery).sort({_id: -1}).limit(pageSize).skip(pageSize * page);
        getPosts = JSON.parse(JSON.stringify(getPosts));

        //Get info about the reposts and quote-posts
        let posts = await fetchFullPosts(getPosts);
        page = Number(page);
        res.json({data: {posts}, page: page == 0 ? 1: page}); 
        return;
    }catch(err){
        if(err.status){
            res.status(err.status).json({error: {message: "Something wrong while fetching posts"}});
        }else{
            res.status(400).json({error: {message: "Something wrong while fetching posts"}});
        }
        //log error here.
        return;
    }
}

exports.postPost = async (req,res) => {

    let validation = await createPostValidations(req);
    if(validation.status == 400){
        if(validation.err){
            //log error here.
        }
        res.status(validation.status).json({ error: validation.error});
        return;
    }
    let newPost = await createPostBody(req.body.data);
    try{
        const savedPost = await newPost.save();
        res.status(200).json({data: {savedPost}});
        //log error here.
        return;
    }catch(err){
        if(err.status){
            res.status(err.status).json({error: {message: "Something went wrong while trying to create that Post"}});
        }else{
            res.status(400).json({error: {message: "Something went wrong while trying to create that Post"}});
        }
        
        //log error here.
        return;
    }
}

exports.getPost = async (req,res) => {
    if(!req.params.postId){
        res.status(400).json({error: {message: "Must send a postId"}})
        //log error here.
        return;
    }
    try{
        const post = await PostModel.findById(req.params.postId);
        res.json({data: {post}});
    }catch(err){
        if(err.status){
            res.status(err.status).json({error: {message: "Something went wrong while trying to fetch that post"}});
        }else{
            res.status(400).json({error: {message: "Something went wrong while trying to fetch that post"}});
        }
        //log error here.
        return;
    }
}

