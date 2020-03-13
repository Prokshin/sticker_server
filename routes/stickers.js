const errors = require("restify-errors");
const Sticker = require("../models/Sticker");
const authContoller = require("../controllers/authController");
module.exports = server => {
  server.get("/stickers", authContoller.protect, async (req, res, next) => {
    try {
      const stickers = await Sticker.find({});
      res.send(stickers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  server.post("/stickers", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next();
    }
    console.log(req.body);

    const sticker = new Sticker(req.body);
    try {
      await sticker.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err));
    }
  });
  server.get("/stickers/:id", async (req, res, next) => {
    try {
      const sticker = await Sticker.findById(req.params.id);
      res.send(sticker);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  server.put("/stickers/:id", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expect application/json"));
    }
    try {
      await Sticker.findByIdAndUpdate(req.params.id, req.body);
      res.send(204);
    } catch (err) {
      send(new errors.InternalError(err));
    }
  });
  server.del("/stickers/:id", async (req, res, next) => {
    try {
      await Sticker.findByIdAndDelete(req.params.id);
      res.send(202);
    } catch (err) {
      send(new errors.InternalError(err));
    }
  });
};
