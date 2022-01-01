const router = require("express").Router();
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");

router.post(
  "/addNew",
  [
    body("container_id").isInt().notEmpty(),
    body("quantity").isInt().notEmpty(),
    body("currentOwner").isInt().notEmpty(),
    body("unitPrice").isInt().notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      connection.query(
        "insert into CONTAINERS VALUES (?,?,?,?);",
        [
          req.body.container_id,
          req.body.quantity,
          req.body.unitPrice,
          req.body.currentOwner,
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(404).json({ errors: error.sqlMessage });
          }
          if (results.length > 0) {
            console.log(`info updated for container_id : ${req.body.user_id}`);
            return res.send(results[0]);
          }
          if (fields) console.log(fields);
          console.log(`added new Container with id: ${req.body.container_id}`);
          return res.send({ Success: "added new Container" });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/", [body("container_id").isInt().notEmpty()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    connection.query(
      "select * from CONTAINERS where ID = ?; ",
      [req.body.container_id],
      (error, results, fields) => {
        if (error) {
          console.log("HERE");
          console.log(error);
          return res.status(404).json({ errors: error });
        }
        if (results.length > 0) {
          console.log(
            `info requested for container_id : ${req.body.container_id}`
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

router.get("/spare", (req, res) => {
  try {
    connection.query(
      "select * from CONTAINERS  where CURRENTOWNER IN (SELECT USERID AS CURRENTOWNER FROM EMPLOYEE);",
      [req.body.container_id],
      (error, results, fields) => {
        if (error) {
          console.log("HERE");
          console.log(error);
          return res.status(404).json({ errors: error });
        }
        if (results.length > 0) {
          console.log(`info requested for spare containers`);
          return res.send(results);
        }
        if (fields) console.log(fields);
        return res.send({ error: "NO container  found" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
