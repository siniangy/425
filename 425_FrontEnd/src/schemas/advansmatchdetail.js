const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let advansMatchDetail = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    team1AdvansDetail: {
      type: Array,
      required: true
    },
    team1AdvansSummary: {
      type: Array,
      required: true
    },
    team2AdvansDetail: {
      type: Array,
      required: true
    },
    team2AdvansSummary: {
      type: Array,
      required: true
    }
  },
  {
    collection: "advansmatchdetail"
  }
);

module.exports = advansMatchDetail;
