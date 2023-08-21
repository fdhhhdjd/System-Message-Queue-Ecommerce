'use strict';

const { consumerQueue } = require('./src/services/consumerQueue.service');

const queueName = 'test-topic';

consumerQueue(queueName)
    .then((_) => {
        console.info('rs:::', queueName);
    })
    .catch((error) => {
        console.error(`Server::`, error);
    });
