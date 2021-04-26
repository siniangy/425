const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let playerAverageData = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    cnName: {
      type: String,
      required: true
    },
    engName: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true
    },
    baidu: {
      type: String,
      required: true
    },
    wiki: {
      type: String,
      required: true
    },
    seasonAvg: {
      type: Array,
      required: true
    }
  },
  {
    collection: "playeraveragedata"
  }
);

module.exports = playerAverageData;
