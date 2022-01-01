const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

router.get(
  "/",
  [body("username").notEmpty(), body("password").notEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //   sanitize input
      let req_username = sql.escape(req.body.username);
      let req_password = sql.escape(req.body.password);
      // retrive salt and password from db and then check the password
      connection.query(
        "select PASSWORD, ID from USER  where USERNAME = ?",
        [req_username],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(404).json({ errors: error.sqlMessage });
          }
          if (results.length > 0) {
            console.log("user_id :" + results[0].ID + " has LOGGED IN...");
            if (!bcrypt.compareSync(req_password, results[0].PASSWORD)) {
              return res.status(403).json({ error: "invalid credentials" });
            } else
              return res.status(200).json({
                success: "password matched",
                token: jwt.sign(
                  { id: results[0].ID },
                  process.env.JWT_SECRET_KEY,
                  {
                    expiresIn: "15m",
                  }
                ),
              });
          }
          if (fields) console.log(fields);

          return res.send({ error: "user not found" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
