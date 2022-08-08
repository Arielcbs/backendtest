const UserModel = require('../models/userModel');


exports.getUser = async (req,res) => {
    try{
        let user = await UserModel.findById(req.params.id);
        user = JSON.parse(JSON.stringify(user));
        delete user.__v;
            user.userId = user._id;
            delete user._id;
        res.json({data: {user}});
    }catch(err){
        //log data here;
        if(err.status){
            res.status(400).json({error: {message: "Oops...Couldn't  fetch that user;"}});  
        }else{
            res.status(400).json({error: {message: "Oops...Couldn't  fetch that user;"}});
        }
        
    }
    
}

exports.getUsers = async (req,res) => {
    try{
        let users = await UserModel.find();
        users = JSON.parse(JSON.stringify(users));
        users.map( user => {
            delete user.__v;
            user.userId = user._id;
            delete user._id;
        })
        res.json({data: {users}});
    }catch(err){
        if(err.status){
            res.status(err.status).json({error: {message: "Oops...Couldn't fetch users;"}});
        }else{
            res.status(400).json({error: {message: "Oops...Couldn't fetch users;"}});
        }
        return;
    }
    
}