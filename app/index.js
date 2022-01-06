console.log("Server is running")

// express
const express = require('express');
const app = express();
const schedule = require('node-schedule');

// body-Parser
const bodyParser = require('body-parser');

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure api router
app.use('/api', require('./api'))

const dbrefresh = require('./script/scheduler/DBRefresh')
var scheduler = schedule.scheduleJob('30 1 * * *', dbrefresh)
console.log("Schedule time :  01:30:00 => DB Refresh")

// open the server
app.listen(3000)

console.log("Port 3000 is open")

