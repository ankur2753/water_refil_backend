const router = require("express").Router();
const connection = require("../connectDB");
const { body, header, validationResult } = require("express-validator");
require("dotenv").config();

router.post(
  "/createOrg",
  [
    body("name").notEmpty().isString(),
    body("city").notEmpty().isString(),
    body("state").notEmpty().isString(),
    body("country").notEmpty().isString(),
    body("email").notEmpty().isEmail(),
    body("owner_id").notEmpty().isInt(),
  ],
  (request, response) => {
    try {
      // check for input in request body
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      let { name, city, state, country, email, owner_id } = request.body;
      // insert into  the table
      connection.query(
        "insert into organization (name,city,state,country,email,owner_id) values (?,?,?,?,?,?);",
        [name, city, state, country, email, owner_id],
        (error, results) => {
          if (error) {
            console.error(error);
            response.statusCode = 400;
            response.send({ error: error.code });
          }
          if (results) {
            console.log("ORGANIZATION CREATED");
            connection.query("SELECT LAST_INSERT_ID() as ID;", (err, res) => {
              if (err) response.status(500).json({ error: error.code });
              if (res)
                response.json({
                  success: "new organization created successfully",
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
  "/joinOrg",
  [body("org_id").notEmpty().isInt(), body("emp_id").notEmpty().isInt()],
  (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }
      connection.query(
        "insert into works_for (user_id,org_id) values (?,?)",
        [request.body.emp_id, request.body.org_id],
        (err, result) => {
          if (err) {
            console.log(err);
            return response.status(404).json({ error: err.code });
          }
          if (result.length > 0) {
          }
          console.log(
            `${request.body.emp_id} joined org ${request.body.org_id}`
          );
          return response.send({
            success: "succefully joined organization",
            results: result[0],
          });
        }
      );
    } catch (error) {
      console.error(error);
      response.status(500).send({ error: error.message });
    }
  }
);

router.get("/", [header("org_id").isInt().notEmpty()], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "bad input", error: errors.array() });
    }

    // check what values are present in the request body
    let { org_id } = req.headers;
    // insert into user_info
    connection.query(
      "select name,city,state,country,email from organization where id = ?",
      [org_id],
      (error, results, fields) => {
        if (error) return res.status(500).json({ error: error.code });
        if (results) {
          console.log("info requested for org_id:\t" + org_id);
          return res.json(results[0]);
        }
      }
    );
    // return jwt token if success
    // return res.send(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/all", (req, res) => {
  try {
    connection.query(
      "select O.name,O.city,O.state,O.country,O.email,P.fname AS OWNER from organization  O, org_owners P where P.userID=O.owner_id",
      (error, results) => {
        if (error) return res.status(500).json({ error: error.code });
        if (results) {
          console.log("list of organizations requested");
          if (results.length > 0) return res.json(results);
          return res.json({ msg: "no organization found" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
