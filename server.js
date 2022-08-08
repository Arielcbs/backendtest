const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const routes = require('./api/routes/routes');
const { createMockData } = require('./api/data/createMockData');
const { createAnonymousUser } = require('./api/helpers/helpers');


const dbUrl = process.env.DB_URL || config.get('dev.dbUrl');
const dbUser = process.env.DB_USER || config.get('dev.dbUser');
const dbPass = process.env.DB_PASS || config.get('dev.dbPass');
const dbPort = process.env.DB_PORT || config.get('dev.dbPort');
const apiPort = process.env.API_PORT || config.get('dev.apiPort');
const createMock = process.env.CREATE_MOCK || config.get('dev.createMock');
let mongoDB = `mongodb://${dbUser}:${dbPass}@${dbUrl}:${dbPort}`;

if(createMock == "true"){
    createMockData();
}else{
    createAnonymousUser();
}



mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', routes);

app.listen(apiPort, () => {
  console.log(`API listening on port ${apiPort}`);
})

module.exports = app;