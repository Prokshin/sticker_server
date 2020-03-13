const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const StickerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  }
});

StickerSchema.plugin(timestamp);
const Sticker = mongoose.model("Sticker", StickerSchema);

module.exports = Sticker;
