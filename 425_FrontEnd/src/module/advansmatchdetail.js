const mongoose = require("mongoose");
const MatchSchema = require("../schemas/advansmatchdetail");
const AdvansMatchDetailBox = mongoose.model("AdvansMatchDetailBox", MatchSchema);

module.exports = AdvansMatchDetailBox;