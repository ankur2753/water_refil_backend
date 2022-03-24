const router = require("express").Router();
const connection = require("../connectDB");
const { body, header, validationResult } = require("express-validator");

// add check for req.id is an employee

router.post(
  "/addNew",
  [body("quantity").isInt().notEmpty(), body("unitPrice").isInt().notEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (req.isCustomer)
        return res
          .status(403)
          .json({ msg: "customer cannot add new containers" });
      connection.query(
        "insert into CONTAINERS(quantity,unitPrice,currentOwner) VALUES (?,?,?);",
        [req.body.quantity, req.body.unitPrice, req.id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(404).json({ error: error.code });
          }
          if (results.length > 0) {
            console.log(`info updated for container_id : ${req.body.user_id}`);
            return res.send(results[0]);
          }
          if (fields) console.log(fields);
          console.log(`added new Container for user with id: ${req.id}`);
          return res.send({ Success: "added new Container" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/", [header("container_id").isInt().notEmpty()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      "select * from CONTAINERS where id = ?; ",
      [req.headers.container_id],
      (error, results, fields) => {
        if (error) {
          console.log("HERE");
          console.log(error);
          return res.status(404).json({ error: error.code });
        }
        if (results.length > 0) {
          console.log(
            `info requested for container_id : ${req.headers.container_id}`
          );
          return res.send(results[0]);
        }
        if (fields) console.log(fields);
        return res.send({ error: "container not found" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

router.get(
  "/spare",
  [header("employee_id").notEmpty().exists()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      connection.query(
        "select id, quantity,unitPrice from CONTAINERS  where currentOwner =? and isBooked =false",
        [req.headers.employee_id],
        (error, results) => {
          if (error) {
            console.log("HERE");
            console.log(error);
            return res.status(404).json({ error: error.code });
          }
          if (results.length > 0) {
            console.log(
              `info requested for spare containers under ${req.headers.emp_name}`
            );
            return res.send(results);
          }
          return res.send({ error: "NO container  found" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
