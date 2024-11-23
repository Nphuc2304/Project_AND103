const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const user = new Schema({
  id: { type: ObjectId },
  username: {
    type: String,
  },
  password: { type: String },
  old: { type: Number },
  products: [{ type: ObjectId, ref: "product" }],
});
module.exports = mongoose.models.user || mongoose.model("user", user);
