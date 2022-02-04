const express = require("express");
const signUp = require("./Routes/signUp");
const signIn = require("./Routes/signIn");
const profiles = require("./Routes/profile");
const containers = require("./Routes/containers");
// const organization = require("./Routes/organization");
const transactions = require("./Routes/transaction");
const authM = require("./auth_middleware");
const deliveries = require("./Routes/delivery");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log("listening on port :" + process.env.PORT);
});

app.use(express.json());
app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/signUp", signUp);
app.use("/signIn", signIn);

// add check for req.id
app.use("/profile", authM, profiles);
app.use("/containers", authM, containers);
// app.use("/organization", authM, organization);
app.use("/transactions", authM, transactions);
app.use("/deliveries", authM, deliveries);
