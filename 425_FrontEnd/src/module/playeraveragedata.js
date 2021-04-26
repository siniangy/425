const mongoose = require("mongoose");
const MatchSchema = require("../schemas/playeraveragedata.js");
const PlayerAverageDataBox = mongoose.model("PlayerAverageDataBox", MatchSchema);

module.exports = PlayerAverageDataBox;
