const router = require("express").Router();
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");

router.get("/customer", [body("user_id").notEmpty().isInt()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      "SELECT * FROM CUSTOMER where USERID = ?",
      [req.body.user_id],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return res.status(404).json({ errors: error.sqlMessage });
        }
        if (results.length > 0) {
          console.log(`info requested for user_id : ${req.body.user_id}`);
          return res.send(results[0]);
        }
        if (fields) console.log(fields);

        return res.send({ error: "user is not a customer" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/employee", [body("user_id").notEmpty().isInt()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      "SELECT * FROM EMPLOYEE where USERID = ?",
      [req.body.user_id],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return res.status(404).json({ errors: error.sqlMessage });
        }
        if (results.length > 0) {
          console.log(`info requested for user_id : ${req.body.user_id}`);
          return res.send(results[0]);
        }
        if (fields) console.log(fields);

        return res.send({ error: "user is not an  employee" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
