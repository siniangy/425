const mongoose = require("mongoose");
const MatchSchema = require("../schemas/basicmatchdetail");
const BasicMatchDetailBox = mongoose.model("BasicMatchDetailBox", MatchSchema);

module.exports = BasicMatchDetailBox;
