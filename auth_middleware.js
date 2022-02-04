require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "no token detected , access denied" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ msg: "invalid Token acces denied" });
    } else {
      req.id = payload.id;
      req.isCustomer = payload.isCustomer;
      next();
    }
  });
};
