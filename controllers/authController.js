const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errors = require("restify-errors");

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.send("need token");
    new errors.BadRequestError();
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, "super secret word");

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded._id);

  if (!currentUser) {
    res.send("bad token");
    new errors.BadRequestError();
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
};
