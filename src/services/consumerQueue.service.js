'use strict';

const { connectToRabbitMQ, consumerQueue } = require('../dbs/init.rabbit');

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error message queue service:::`, error);
        }
    },
};
module.exports = messageService;
