'use strict';

//* LIBRARY
const amqp = require('amqplib');
const path = require('path');

//* USED LIBRARY
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.HOST_RABBIT);

        if (!connection) throw new Error("Couldn't connect to RabbitMQ");

        const channel = await connection.createChannel();

        return {
            channel,
            connection,
        };
    } catch (error) {
        console.error('Get started', error);
        throw error;
    }
};

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ();

        // Publish message to queue
        const queue = 'test-queue';
        const message = 'Hello Tai Dev test RabbitMQ';

        // Create queue
        await channel.assertQueue(queue);

        // Send message to queue
        await channel.sendToQueue(queue, Buffer.from(message));

        // Close connection to queue
        await connection.close();
    } catch (error) {
        console.error('Connect Fail', error);
        throw error;
    }
};

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {
            // Reliability message if server crash if then server restart  then message auto send continue
            durable: true,
        });
        console.info('Waiting for queue');

        channel.consume(
            queueName,
            (msg) => {
                console.info(
                    `Received message: ${queueName}:::`,
                    msg.content.toString(),
                );
            },
            {
                // Already have , not send a message for me
                noAck: true,
            },
        );
    } catch (error) {
        return console.error(error);
    }
};
module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue,
};
