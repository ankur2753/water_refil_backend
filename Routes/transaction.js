const router = require("express").Router();
const connection = require("../connectDB");
const { body, header, validationResult } = require("express-validator");
const req = require("express/lib/request");
require("dotenv").config();

router.post(
  "/",
  [
    body("container_id", "A container ID is required")
      .exists()
      .notEmpty()
      .isInt(),
    body("employee_id").exists().isInt(),
  ],
  (request, response) => {
    try {
      // check for input in request
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      // insert into  the table
      connection.query(
        "insert into transactions (customerID,containerID) values (?,?);update containers set isBooked =true where id=?;insert into deliveries (employeeID,customerID,containerID) values (?,?,?);",
        [
          request.id,
          request.body.container_id,
          request.body.container_id,
          request.body.employee_id,
          request.id,
          request.body.container_id,
        ],
        (error, results) => {
          if (error) {
            console.error(error);
            response.statusCode = 400;
            response.send({ error: error.code });
          }
          if (results) {
            console.log("TRANSACTIONS CREATED");
            connection.query("SELECT LAST_INSERT_ID() as ID;", (err, res) => {
              if (err) response.status(500).json({ error: error.code });
              if (res)
                response.json({
                  success: "new transaction created successfully",
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

router.get(
  "/",
  [header("transaction_id").isInt().notEmpty()],
  (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({ msg: "bad input", error: errors.array() });
      }

      // check what values are present in the request body
      let { transaction_id } = request.headers;
      // insert into user_info
      connection.query(
        "select * from transactions where id = ?",
        [transaction_id],
        (error, results, fields) => {
          if (error) return response.status(500).json({ error: error.code });
          if (results) {
            console.log(
              "info requested for transaction_id:\t" + transaction_id
            );
            if (results[0]) return response.json(results[0]);
            console.log(
              "TRANSACTION NOT FOUND FOR TRANSACTION ID :\t" + transaction_id
            );
            return response.json({ msg: "transaction not found" });
          }
          if (fields) console.log(fields);
        }
      );
      // return jwt token if success
      // return res.send(req.body);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
