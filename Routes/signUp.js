const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const connection = require("../connectDB");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

router.post(
  "/",
  [
    body("username").notEmpty(),
    body("password").notEmpty().isAlphanumeric(),
    body("isCustomer").notEmpty().isBoolean(),
  ],
  (request, response) => {
    try {
      // check for input in request body
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      // sanitize input
      let username = sql.escape(request.body.username);
      let password = sql.escape(request.body.password);
      // hash password
      let hashed_pass = bcrypt.hashSync(password, bcrypt.genSaltSync());
      // insert into  the table
      connection.query(
        "insert into USER (USERNAME,PASSWORD,isCUSTOMER) values (?,?,?);",
        [username, hashed_pass, request.body.isCustomer],
        (error, results) => {
          if (error) {
            console.error(error);
            response.statusCode = 400;
            response.send({ error: error.code });
          }
          if (results) {
            connection.query("SELECT LAST_INSERT_ID() as ID;", (err, res) => {
              if (err) response.status(500).json({ error: error.code });
              if (res)
                response.json({
                  success: "new user created successfully",
                  token: jwt.sign(
                    {
                      id: res[0].ID,
                      isCustomer: request.body.isCustomer,
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                      expiresIn: "15m",
                    }
                  ),
                });
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
