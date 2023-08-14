"use strict";

//* DB
const { connectToRabbitMQForTest } = require("../dbs/init.rabbit");

describe("RabbitMQ Connection", () => {
  it("should connect to successful rabbitMQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
