const express = require('express');
const router = express.Router();

const { listPosts, postPost, getPost } = require('../controllers/postController');
const { getUser, getUsers, createUser } = require('../controllers/userController');
//USER ROUTES

//Get user by ID
router.get('/user/:id', getUser)

router.get('/users', getUsers)

//POSTS ROUTES
//Post a post
router.post('/post', postPost)

//Get posts
router.get('/posts', listPosts)

//Get post by id
router.get('/post/:postId', getPost)



module.exports = router;