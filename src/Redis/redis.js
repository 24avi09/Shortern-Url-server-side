//=====================Importing Module and Packages=====================//
const redis = require('redis')
const { promisify } = require('util')



//===================== Connect to Redis =====================//
const redisClient = redis.createClient(
    16861,
    "redis-16861.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("MH9Bmrq0UOiN9L4lCRSqKF9JCGsbHMyL", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//===================== Connection setup for Redis =====================//
const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



//=====================Module Export=====================//
module.exports = { GET_ASYNC, SET_ASYNC };