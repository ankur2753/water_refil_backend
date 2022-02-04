const router = require("express").Router();
const connection = require("../connectDB");
const { body, validationResult } = require("express-validator");

router.get("/", (request, response) => {
  try {
    console.log(request.isCustomer);
    if (request.isCustomer)
      connection.query(
        "SELECT * FROM CUSTOMER where USERID = ?",
        [request.id],
        (error, results) => {
          if (error) {
            console.log(error);
            return response.status(404).json({ error: error.code });
          }
          if (results.length > 0) {
            console.log(`info requested for user_id : ${request.id}`);
            return response.send(results[0]);
          }

          return response.send({ error: "user is not a customer" });
        }
      );
    else
      connection.query(
        "SELECT * FROM EMPLOYEE where USERID = ?",
        [request.id],
        (error, results) => {
          if (error) {
            console.log(error);
            return response.status(404).json({ error: error.code });
          }
          if (results.length > 0) {
            console.log(`info requested for user_id : ${request.id}`);
            return response.send(results[0]);
          }

          return response.send({ error: "user is not an  employee" });
        }
      );
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: error.message });
  }
});

router.get("/emp", (request, response) => {
  try {
    connection.query(
      "SELECT fname,mname,lname,userID FROM EMPLOYEE",
      [request.id],
      (error, results) => {
        if (error) {
          console.log(error);
          return response.status(404).json({ error: error.code });
        }
        if (results.length > 0) {
          console.log(`info requested for all Emp by user:\t ${request.id}`);
          return response.send(results);
        }

        return response.send({
          error: "No Employee Found Try Creating a new One",
        });
      }
    );
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: error.message });
  }
});

router.post(
  "/create",
  [
    body("email").isEmail(),
    body("fname").isString(),
    body("mname").isString().optional(),
    body("lname").isString(),
    body("city").isString(),
    body("state").isString(),
    body("street").isString(),
    body("country").isString(),
    body("phone").isMobilePhone(),
    body("salary").optional().isInt(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "bad input", error: errors.array() });
      }

      let {
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
      // check what values are present in the request body
      if (req.isCustomer) {
        // insert into user_info
        connection.query(
          "insert into CUSTOMER (USERID,EMAIL,FNAME,MNAME,LNAME,CITY,STREET,COUNTRY,PHONE,STATE)  values (?,?,?,?,?,?,?,?,?,?)",
          [
            req.id,
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
          (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results) {
              console.log("new profile created for user_id:" + req.id);
              return res.json({
                success: "user profile created successfully",
                results,
              });
            }
          }
        );
        // return jwt token if success
        // return res.send(req.body);
      } else
        connection.query(
          "insert into employee (USERID,EMAIL,FNAME,LNAME,CITY,STREET,COUNTRY,PHONE,STATE,SALARY,MNAME)  values (?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.id,
            email,
            fname,
            lname,
            city,
            street,
            country,
            phone,
            state,
            salary,
            mname,
          ],
          (error, results) => {
            if (error) return res.status(500).json({ error: error });
            if (results) {
              console.log("new profile created for user_id:" + req.id);
              return res.json({
                success: "user profile created successfully",
                results,
              });
            }
          }
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
module.exports = router;
