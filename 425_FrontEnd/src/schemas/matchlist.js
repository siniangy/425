const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let matchList = new Schema(
  {
    date: {
      type: String,
      required: true
    },
    content: {
      type: Array,
      required: true
    },
    url: {
      type: Array,
      required: true
    }
  },
  {
    collection: "matchlist"
  }
);

module.exports = matchList;
