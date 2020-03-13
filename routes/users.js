const errors = require("restify-errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const jwt = require("jsonwebtoken");

module.exports = server => {
  server.get("/users", async (req, res, next) => {
    try {
      const users = await User.find({});
      res.send(users);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  server.post("/users", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expect application/json"));
    }
    const { name, email } = req.body;
    const user = new User({
      name,
      email
    });
    try {
      await user.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.massage));
    }
  });
  server.get("/users/:id", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  server.put("/users/:id", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expect application/json"));
    }
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.send(204);
    } catch (err) {
      send(new errors.InternalError(err));
    }
  });
  server.del("/users/:id", async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.send(202);
    } catch (err) {
      send(new errors.InternalError(err));
    }
  });
  server.post("/register", (req, res, next) => {
    const user = User(req.body);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash Password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Authenticate User
      const user = await auth.authenticate(email, password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), "super secret word", {
        expiresIn: "15m"
      });

      const { iat, exp } = jwt.decode(token);
      // Respond with token
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
