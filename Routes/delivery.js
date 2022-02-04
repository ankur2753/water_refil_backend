const router = require("express").Router();
const connection = require("../connectDB");
const { body, header, validationResult } = require("express-validator");
require("dotenv").config();

router.post(
  "/toggleStatus",
  [body("id").exists().notEmpty().isInt()],
  (request, response) => {
    try {
      // check for input in request body
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      // check if req.id is a org owner or not
      //if not return error response
      // else
      // insert into  the table
      connection.query(
        "select * from deliveries where id = ?",
        [request.body.id],
        (error, results) => {
          if (error) {
            console.error(error);
            response.statusCode = 400;
            response.send({ error: error.code });
          }
          if (results) {
            console.log(results);
            if (results[0].employeeID === request.id)
              connection.query(
                "update deliveries set isCompleted=? where id =?",
                [!results[0]?.isCompleted, request.body.id],
                (err, res) => {
                  if (err) response.status(500).json({ error: error.code });
                  if (res)
                    response.json({
                      success: `the delivery was marked as ${
                        results[0].isCompleted ? "Pending" : "Completed"
                      }`,
                    });
                }
              );
            else return response.status(403).json({ msg: "unautorized" });
          }
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: error.message });
    }
  }
);

router.get("/byID", [header("delivery_id").isInt().notEmpty()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "bad input", error: errors.array() });
    }

    // check what values are present in the request body
    let { delivery_id } = req.headers;
    // insert into user_info
    connection.query(
      "select * from deliveries where id = ?",
      [delivery_id],
      (error, results, fields) => {
        if (error) return res.status(500).json({ error: error.code });
        if (results) {
          console.log("info requested for delivery_id:\t" + delivery_id);
          if (results.length < 1)
            return res.json({ msg: "no deliveries found" });
          return res.json(results[0]);
        }
        if (fields) console.log(fields);
      }
    );
    // return jwt token if success
    // return res.send(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/emp", (req, res) => {
  try {
    connection.query(
      "select * from deliveries where employeeID = ?",
      [req.id],
      (error, results) => {
        if (error) return res.status(500).json({ error: error.code });
        if (results) {
          console.log("info requested for deliveries of employee:\t" + req.id);
          if (results.length < 1)
            return res.json({ msg: "no deliveries found" });
          return res.json(results);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/prev", (req, res) => {
  try {
    connection.query(
      "select  D.*,C.quantity from deliveries D,Containers C where customerID = ? AND D.containerID=C.id",
      [req.id],
      (error, results) => {
        if (error) return res.status(500).json({ error: error.code });
        if (results) {
          console.log("info requested for delivery_id:\t" + req.id);
          if (results.length > 0) return res.json(results);
          return res.json({ msg: "no orders found" });
        }
      }
    );
    // return jwt token if success
    // return res.send(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
