const client = require("./redisClient");
const { handleAlert } = require("../services/aiBlockchainAlert");

async function consumeQueueMessage(message) {
  await handleAlert(message);
}

async function startQueueConsumer() {
  const channel = "notifications";

  await client.subscribe(channel, async (message) => {
    console.log(`Received message from ${channel}: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      await consumeQueueMessage(parsedMessage);
    } catch (err) {
      console.error("Error processing queue message:", err);
    }
  });

  console.log(`Subscribed to Redis channel: ${channel}`);
}

module.exports = { startQueueConsumer };
