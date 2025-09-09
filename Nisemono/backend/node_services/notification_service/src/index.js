const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./utils/config");
const notificationRoutes = require("./routes/notification.routes");
const { startQueueConsumer } = require("./utils/queueConsumer");

const app = express();

app.use(bodyParser.json());

app.use("/notify", notificationRoutes);

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

startQueueConsumer();
