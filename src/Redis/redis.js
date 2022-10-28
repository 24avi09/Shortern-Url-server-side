//=====================Importing Module and Packages=====================//
const redis = require('redis')
const { promisify } = require('util')



//===================== Connect to Redis =====================//
const redisClient = redis.createClient(                          // creating cient 
    16861,                                                      // redis posrt number 
    "redis-16861.c264.ap-south-1-1.ec2.cloud.redislabs.com",    //complete host name
    { no_ready_check: true }
);
redisClient.auth("MH9Bmrq0UOiN9L4lCRSqKF9JCGsbHMyL", function (err) {  //password 
    if (err) throw err;
});

redisClient.on("connect", async function () {     // listener after connection just print this 
    console.log("Connected to Redis..");
});

//===================== Connection setup for Redis =====================//
const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);  //promisify= promise, call back fun ki jagah promise return krega 
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);    //set command ke corresponding= return a function
                                                                   // bind(redisClient) = binding this client with the function 
                                                                   // only accept and returns string 


//=====================Module Export=====================//
module.exports = { GET_ASYNC, SET_ASYNC };