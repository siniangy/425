const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let basicMatchDetail = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    team1Info: {
      type: Array,
      required: true
    },
    team2Info: {
      type: Array,
      required: true
    },
    team1Home: {
      type: Array,
      required: true
    },
    team2Home: {
      type: Array,
      required: true
    },
    team1Score: {
      type: Array,
      required: true
    },
    team2Score: {
      type: Array,
      required: true
    },
    team1Detail: {
      type: Array,
      required: true
    },
    team1Summary: {
      type: Array,
      required: true
    },
    team2Detail: {
      type: Array,
      required: true
    },
    team2Summary: {
      type: Array,
      required: true
    }
  },
  {
    collection: "basicmatchdetail"
  }
);

module.exports = basicMatchDetail;
