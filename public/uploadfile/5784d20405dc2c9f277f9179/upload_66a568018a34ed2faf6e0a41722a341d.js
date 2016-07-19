const redis=require('redis');
const publisher=redis.createClient(6379,'172.23.238.253');

publisher.publish('chat','hello');
