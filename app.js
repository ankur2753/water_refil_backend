const express = require("express");
const signUp = require("./Routes/signUp");
const signIn = require("./Routes/signIn");
const profiles = require("./Routes/profile");
const containers = require("./Routes/containers");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log("listening on port :" + process.env.PORT);
});

app.use(express.json());

app.use("/signUp", signUp);
app.use("/signIn", signIn);
app.use("/profile", profiles);
app.use("/containers", containers);
