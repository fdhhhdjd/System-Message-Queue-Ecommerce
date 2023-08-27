'use strict';

const { connectToRabbitMQ, consumerQueue } = require('../dbs/init.rabbit');

const log = console.info;

console.info = function () {
    log.apply(console, [new Date()].concat(arguments));
};

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error message queue service:::`, error);
        }
    },

    // Case Processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();

            const notificationQueue = 'notificationQueueProcess'; // assert Queue

            const timeExpired = 12000;
            setTimeout(() => {
                channel.consume(notificationQueue, (msg) => {
                    console.info(
                        `Send notificationQueue successfully processed`,
                        msg.content.toString(),
                    );
                    channel.ack(msg);
                });
            }, timeExpired);
        } catch (error) {
            console.error(error);
        }
    },

    // Case fail Processing
    consumerToQueueFail: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            const notificationExchangeDLX = 'notificationExDLX'; // notification direct
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // notification assert
            const notificationHandler = 'notificationHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true, // Availability
            });
            const queueResult = await channel.assertQueue(notificationHandler, {
                exclusive: false, // Only 1 connection handle
            });

            await channel.bindQueue(
                queueResult.name,
                notificationExchangeDLX,
                notificationRoutingKeyDLX,
            );

            await channel.consume(
                queueResult.queue,
                (msgFailed) => {
                    console.info(
                        `This notification error Hotfix: `,
                        msgFailed.content.toString(),
                    );
                },
                {
                    noAck: true,
                },
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
module.exports = messageService;
