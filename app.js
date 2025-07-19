const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const menuRoute = require("./routes/menu");
app.use("/menu", menuRoute);

const offersRoute = require("./routes/offers");
app.use("/offers", offersRoute);

const ordersRoute = require("./routes/orders");
app.use("/orders", ordersRoute);

app.get("/", (req, res) => {
  res.send("🚀 MIAMI Server is Live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});