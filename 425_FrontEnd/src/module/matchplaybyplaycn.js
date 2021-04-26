const mongoose = require("mongoose");
const MatchSchema = require("../schemas/matchplaybyplaycn");
const MatchPlayByPlaycnBox = mongoose.model("MatchPlayByPlaycnBox", MatchSchema);

module.exports = MatchPlayByPlaycnBox;
