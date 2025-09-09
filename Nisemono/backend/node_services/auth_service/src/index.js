const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const {
  PORT,
} = require("../../../node_services/notification_service/src/utils/config");

const app = express();

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
