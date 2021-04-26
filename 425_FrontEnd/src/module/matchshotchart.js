const mongoose = require("mongoose");
const MatchSchema = require("../schemas/matchshotchart");
const MatchShotChartBox = mongoose.model("MatchShotChartBox", MatchSchema);

module.exports = MatchShotChartBox;
