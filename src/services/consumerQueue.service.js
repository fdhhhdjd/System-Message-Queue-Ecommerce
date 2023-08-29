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

            // 1. TTL

            // const timeExpired = 12000;
            // setTimeout(() => {
            //     channel.consume(notificationQueue, (msg) => {
            //         console.info(
            //             `Send notificationQueue successfully processed`,
            //             msg.content.toString(),
            //         );
            //         channel.ack(msg);
            //     });
            // }, timeExpired);

            // 2. Logic
            channel.consume(notificationQueue, (msg) => {
                try {
                    const numberTest = Math.random();
                    console.info({ numberTest });

                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed: Hot Fix');
                    }

                    console.info(
                        `Send notification Success`,
                        msg.content.toString(),
                    );
                    channel.ack(msg);
                } catch (error) {
                    /*
                        nack: Negative acknowledgement ( Xác nhận tiêu cực)
                        false: Không được đẩy vào hàng đợi ban đầu nữa, mà đẩy xuống.
                        false: Chỉ tin nhắn hiện tại được từ chối mà thôi
                    */

                    channel.nack(msg, false, false);
                }
            });
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
