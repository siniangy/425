const mongoose = require("mongoose");
const MatchSchema = require("../schemas/matchlist");
const MatchListBox = mongoose.model("MatchListBox", MatchSchema);

module.exports = MatchListBox;
