const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let clientSchema = new Schema({
  _id: { type: String },
  manu: { type: Boolean, default: false },
  reason: { type: String },
  blacklist: { type: Array, default: [] },
  ranks: {
    coins: { type: Array, default: [] },
  },
});

let Client = mongoose.model("Client", clientSchema);
module.exports = Client;
