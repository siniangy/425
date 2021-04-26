const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let matchPlayByPlaycn = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    quarter1: {
      type: Array,
      required: true
    },
    quarter2: {
      type: Array,
      required: true
    },
    quarter3: {
      type: Array,
      required: true
    },
    quarter4: {
      type: Array,
      required: true
    }
  },
  {
    collection: "matchplaybyplaycn"
  }
);

module.exports = matchPlayByPlaycn;
