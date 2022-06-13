const mongoose = require("mongoose");
const BaseActionLending = require("./baseLending");

const Schema = mongoose.Schema;

let Supply = new Schema(BaseActionLending, { collection: "supply" });

module.exports = mongoose.model("Supply", Supply);
