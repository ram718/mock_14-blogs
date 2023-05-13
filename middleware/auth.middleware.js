const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    if (decoded) {
      req.body.userID = decoded.userID;
      next();
    } else {
      res.status(400).send({ msg: "Login first" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
};

module.exports = { auth };
