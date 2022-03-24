const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

router.post(
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
        "select password, id,isCustomer from USER  where username = ?",
        [req_username],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.status(404).json({ error: error.code });
          }
          if (results.length > 0) {
            console.log("user_id :" + results[0].id + " has LOGGED IN...");
            if (!bcrypt.compareSync(req_password, results[0].password)) {
              return res.status(401).json({ error: "invalid credentials" });
            } else
              return res.status(200).json({
                success: "password matched",
                isCustomer: results[0].isCustomer ? true : false,
                token: jwt.sign(
                  {
                    id: results[0].id,
                    isCustomer: results[0].isCustomer ? true : false,
                  },
                  process.env.JWT_SECRET_KEY,
                  {
                    expiresIn: "15m",
                  }
                ),
              });
          }

          return res.send({ error: "user not found" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

// router.post(
//   "/getToken",
//   [body("refreshToken").exists()],
//   (request, response) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       // verify refresh token
//       // genrate new refresh token and access token
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: error.message });
//     }
//   }
// );

module.exports = router;
