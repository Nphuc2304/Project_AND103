const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const channel = new Schema({
  channelName: {
    type: String,
  },
  channelImage: { type: String },
  description: { type: String },
  followedChannel: { type: Number },
});
module.exports = mongoose.models.channel || mongoose.model("channel", channel);
