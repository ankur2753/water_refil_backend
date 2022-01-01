const router = require("express").Router();
const sql = require("mysql");
const bcrypt = require("bcryptjs");
const connection = require("../connectDB");
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
            response.send({ error: error.message });
          }
          if (results) {
            connection.query("SELECT LAST_INSERT_ID() as ID;", (err, res) => {
              if (err) response.status(500).json({ err });
              if (res)
                response.json({
                  success: "new user created successfully",
                  id: res[0].ID,
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

router.post(
  "/customerProfile",
  [
    body("user_id").isInt().notEmpty(),
    body("email").isEmail(),
    body("fname").isString(),
    body("mname").isString(),
    body("lname").isString(),
    body("city").isString(),
    body("state").isString(),
    body("street").isString(),
    body("country").isString(),
    body("phone").isMobilePhone(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      // sanitize for sql
      // check what values are present in the request body
      let {
        user_id,
        email,
        fname,
        mname,
        lname,
        city,
        street,
        state,
        country,
        phone,
      } = req.body;
      let query =
        "insert into CUSTOMER (USERID,EMAIL,FNAME,MNAME,LNAME,CITY,STREET,COUNTRY,PHONE,STATE)  values (?,?,?,?,?,?,?,?,?,?)";
      // insert into user_info
      connection.query(
        query,
        [
          user_id,
          email,
          fname,
          mname,
          lname,
          city,
          street,
          country,
          phone,
          state,
        ],
        (error, results, fields) => {
          if (error) return res.status(500).json({ error });
          if (results) {
            console.log("new profile created for user_id:" + user_id);
            return res.json({
              success: "user profile created successfully",
              results,
            });
          }
          if (fields) console.log(fields);
        }
      );
      // return jwt token if success
      // return res.send(req.body);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/employeeProfile",
  [
    body("user_id").isInt().notEmpty(),
    body("email").isEmail(),
    body("fname").isString(),
    body("mname").isString(),
    body("lname").isString(),
    body("city").isString(),
    body("state").isString(),
    body("street").isString(),
    body("country").isString(),
    body("phone").isMobilePhone(),
    body("salary").isInt(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      // sanitize for sql
      // check what values are present in the request body
      let {
        user_id,
        email,
        fname,
        mname,
        lname,
        city,
        street,
        state,
        country,
        phone,
        salary,
      } = req.body;
      let query =
        "insert into employee (USERID,EMAIL,FNAME,MNAME,LNAME,CITY,STREET,COUNTRY,PHONE,STATE,SALARY)  values (?,?,?,?,?,?,?,?,?,?,?)";
      // insert into user_info
      connection.query(
        query,
        [
          user_id,
          email,
          fname,
          mname,
          lname,
          city,
          street,
          country,
          phone,
          state,
          salary,
        ],
        (error, results, fields) => {
          if (error) return res.status(500).json({ error });
          if (results) {
            console.log("new profile created for user_id:" + user_id);
            return res.json({
              success: "user profile created successfully",
              results,
            });
          }
          if (fields) console.log(fields);
        }
      );
      // return jwt token if success
      // return res.send(req.body);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
module.exports = router;
