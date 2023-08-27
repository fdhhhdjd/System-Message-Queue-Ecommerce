'use strict';

const {
    consumerQueue,
    consumerToQueueFail,
    consumerToQueueNormal,
} = require('./src/services/consumerQueue.service');

const queueName = 'test-topic';

// consumerQueue(queueName)
//     .then((_) => {
//         console.info('rs:::', queueName);
//     })
//     .catch((error) => {
//         console.error(`Server::`, error);
//     });

consumerToQueueNormal(queueName)
    .then((_) => {
        console.info('Message consumerToQueueNormal:::', queueName);
    })
    .catch((error) => {
        console.error(`Server::`, error.message);
    });

consumerToQueueFail(queueName)
    .then((_) => {
        console.info('Message consumerToQueueFail:::', queueName);
    })
    .catch((error) => {
        console.error(`Server::`, error.message);
    });
