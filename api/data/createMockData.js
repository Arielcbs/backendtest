const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');


let date = new Date();
let month = date.toLocaleString('en-US', {month: 'long'})
let year = date.getFullYear();
let day = date.getDay();


const createMockData = async () => {
    try{
        let deleteAll = await UserModel.deleteMany({});

        try{
            let anonymous = await UserModel.create({"username": "Anonymous", "createDate": `${month} ${day}, ${year}` });
            let jen = await UserModel.create({"username": "Jennifer", "createDate": `${month} ${day}, ${year}` })
            let van = await UserModel.create({"username": "Vanessa", "createDate": `${month} ${day}, ${year}`})
            let bob = await UserModel.create({"username": "Bob", "createDate": `${month} ${day}, ${year}`})
            let eric = await UserModel.create({"username": "Eric", "createDate": `${month} ${day}, ${year}`})
            console.log("Anonymous user created");
    
            try{
                PostModel.create({
                    "postUserId": eric.id,
                    "postType": "post",
                    "postData": "Eric's 2 cents"
                })
                PostModel.create({
                    "postUserId": van.id,
                    "postType": "post",
                    "postData": "Hi guys posting here for the first time. PS: Vanessa",
                    "createDate": new Date()
                    
                })
                PostModel.create({
                    "postUserId": bob.id,
                    "postType": "post",
                    "postData": "Ladies and Gentleman, Bob has entered the building",
                    "createDate": new Date()
                })
                PostModel.create({
                    "postUserId": jen.id,
                    "postType": "post",
                    "postData": "A post from Jennifer",
                    "createDate": new Date()
        
                })
                console.log('Mock data created');
            }catch(err){
                console.log("Something went wrong while trying to create mock posts");
            }
           
        }catch(err){
            console.log("Something went wrong while trying to create mock users");
        }
    }catch(err){
        console.log("Something went wrong while trying to delete all data from DB to start creating mock data");
    }

}


module.exports = { createMockData} ;