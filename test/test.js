let mongoose = require("mongoose");
let Book = require('../api/models/userModel');
let helpers = require('../api/helpers/helpers');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe('Profile Page', () => {
    var userId;
    describe('/GET Users', () => {
        it('It should get all users', (done) => {
            chai.request(server)
            .get('/api/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                userId = res.body.data.users[0].userId;
                done();
            })
        })
    })
    describe('/GET first user of the list', () => {
        it('It should get the first user of the list', (done) => {
            chai.request(server)
            .get(`/api/user/${userId}`)
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('user');
                res.body.data.user.should.have.property('createDate');
                console.log("Response for the fetch of a user: ",res.body.data);
                done();
            })
        })
    })
    describe('/POST create post for selected user' , () => {
        it('It should create a post for the selected user. OBS: This test may not pass if user already created 5 posts in the day.', (done) => {
            chai.request(server)
            .post(`/api/post`)
            .send({
                "data":{
                    "userId": userId,
                    "postType": "post",
                    "postData": "A test post"
                }
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('savedPost');
                console.log('Response for created post: ',res.body.data);
                done();
            })
           
        })
    })
    describe('/GET posts of user', () => {
        var today = helpers.createCustomDate();
        it('It should get only today posts of the user, limit of 5 per page', (done) => {
            chai.request(server)
            .get(`/api/posts?user-id=${userId}&date-from=${today}&date-to=${today}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('posts');
                res.body.data.posts.should.be.a('array');
                let length = res.body.data.posts.length;
                expect(length).to.be.lessThan(6);
                res.body.data.posts.map( post => {
                    let day = new Date().getDay();
                    let postDay = new Date(post.createDate).getDay();
                    expect(day).to.eql(postDay);
                })
                res.body.should.have.property('page');
                res.body.page.should.be.a('number');
                console.log('Response for get posts: ',res.body);
                done();
            })
        })
    })
    describe('/GET posts of user, page 2', () => {
        var today = helpers.createCustomDate();
        it('It should get only page 2 of todays posts. No posts are going to be returned because of the limit of 5 posts per day.', (done) => {
            chai.request(server)
            .get(`/api/posts?user-id=${userId}&date-from=${today}&date-to=${today}&page=2`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('posts');
                res.body.data.posts.should.be.a('array');
                let length = res.body.data.posts.length;
                expect(length).to.be.eql(0);
                res.body.should.have.property('page');
                expect(res.body.page).to.eql(2);
                console.log('Response for get posts page 2: ',res.body);
                done();
            })
        })
    })
})

describe('Home Page', () => {    
    describe('/POST create post with no userId.' , () => {
        it('It should create a post with user Anonymous', (done) => {
            chai.request(server)
            .post(`/api/post`)
            .send({
                "data":{
                    "postType": "post",
                    "postData": "A test post from home page"
                }
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('savedPost');
                console.log('Response for created post: ',res.body.data);
                done();
            })
           
        })
    })
    describe('/GET posts', () => {
        it('It should get the lastest 10 posts', (done) => {
            chai.request(server)
            .get(`/api/posts`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('posts');
                res.body.data.posts.should.be.a('array');
                let length = res.body.data.posts.length;
                expect(length).to.be.lessThan(11);
                res.body.should.have.property('page');
                res.body.page.should.be.a('number');
                console.log('Response for get posts: ',res.body);
                done();
            })
        })
    })
    describe('/GET posts of user, page 2', () => {
        var today = helpers.createCustomDate();
        it('It should get only page 2 of todays posts. No posts are going to be returned because of the limit of 5 posts per day.', (done) => {
            chai.request(server)
            .get(`/api/posts?page=2`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('data');
                res.body.data.should.have.property('posts');
                res.body.data.posts.should.be.a('array');
                let length = res.body.data.posts.length;
                expect(length).to.be.lessThan(11);
                res.body.should.have.property('page');
                expect(res.body.page).to.eql(2);
                console.log('Response for get posts page 2: ',res.body);
                done();
            })
        })
    })
})