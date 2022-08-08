# Test backend

This project consists of an API with 2 models, Users and Posts.

The API consumes a MongoDB database.

Project was made using NodeJS, Express and Mongoose to connect with mongo.

For the automated tests and dev environment were used Mocha and Chai and Config.

## Installation
To set up the environment in Docker, first create the Docker image for the backend, enter the folder of the Backend Test and:
```
docker build -t test-backend:1.0.0 .
```
Then we will need to pull the mongo image
```
docker pull mongo:latest
```
Now check Docker Compose file.
If you wish to have some mocked data in first install, leave the "CREATE_MOCK" environment variable set to TRUE.
Then in your terminal hit: 
```
docker compose up
```
And everything should be ready to go.

- If you wish to debug locally you can open VSCode and run the Debug using the launch.json file.
- Configuration for Dev env is set in /api/config/default.json
- If you want to create more mocked data, the file is in /api/data/createMockData.js

## Details of the API
## USERS

The Users API has two methods:

Get all
```
/api/users
```

Get by Id
```
/api/users/:userId
```
The Id is generated by the Database


## POSTS

The Posts API has three methods:

### Create post

To create a Post, make a post request to
```
/api/post
```
- Using the body structure
```
{
    "data":{
        "postUserId": "String", // UserId (optional), if not used post will be created with user Anonymous
        "postType": "String", // three options [post, repost, quotepost]
        "postData": "String", //Max 777 characters
        "attachedPost": "String", // PostId , only required if postType is set to "repost" or "quotepost"
    }
}

```

### Get posts

```
/api/posts
```
- In this endpoint we have a few query params available to filter the query
- If no parameter is set, query will return the last 10 posts.


    #### Query params:
    ```
    user-id
    ```
    - Fetches the Posts by the user Id, and the page size will be decreased to 5



    ```
    page
    ````
    - If not set, page will automatically be set to 1.



    ```
    date-from
    date-to
    ```
    - date-from and date-to are Date range filters, you can use both or only one of this at a time. 
    - The parameter that is not set will be defaulted to Today.



### Get post by Id
```
/api/post/:postId
```



# CRITIQUE

So first of all I would like to set an Architecture pattern for the project, probably the company already uses one so I should follow the default of the company.
Also improve the MVC used, right now I did not use services and actions for my controllers, everything is mixed up in controllers just for the ease of setting this up as fast as I could. So I need to revisit this ASAP.
Another thing I needed to insert right now is a logger for the errors.

After that, I'd like to understand more about the project, where is this going and what are the needs that need to be met.
 - Like for example:
     - Is this going to be an intranet or internet social media?
     - Who is our target consumer/persona?
     - Do we have any idea on what are the functions needed to the final MVP of the project? 
     - Or even better, idea of the final product?
     - ... and so on...

For this exercise we haven't created an Auth method for the API, but this needs to be implemented ASAP for delivering in production.

Creating a pageSize parameter for a query seems better for me, but for the simplification of the challenge here I prefered to hard code it, is something really simple to add at this point.

Coments on posts will also be a desirable thing to have, so this would be one of the first things to add.
Probably a fun thing to have is a Blobstore component to create the hability to post things with videos and images as well.

After that with more information in hands, I'd improve the Database, insert new fields and validations for each model, create more models like a Feed, where each user can see specific posts that they might prefer.

Also the hability to friend/follow people to see their posts, so they will be inserted/removed from their Feed.

With more time I can also improve the Node methods and validations of the Database, a lot of stuff is being validated inside my NodeJS code right now just for the sake of simplicity on creating it as fast as I could.

An improvement necessary right now would be a PVC component on the Database to persist information, right now if we loose the container we lose everything.

For scaling, we need to have a Caching strategy, implement a load balancer and sharding of the Database

Maybe at some point it would be interesting to check if Cassandra, CloudSQL(Google) or some other DB is a better fit than MongoDB. I did it with mongo just to create the MVP because I have more experience with it at the moment.

Another thing we could improve thinking in scaling, is creating a deployment method pipeline in some CI/CD and deploying to a kubernetes environment.




