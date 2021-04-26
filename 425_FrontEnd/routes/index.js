var express = require("express");
var router = express.Router();
var MatchList = require("../src/module/matchlist");
var BasicMatchDetail = require("../src/module/basicmatchdetail");
var AdvansMatchDetail = require("../src/module/advansmatchdetail");
var PlayerAverageData = require("../src/module/playeraveragedata");
var MatchPlayByPlaycn = require("../src/module/matchplaybyplaycn");
var MatchShotChart = require("../src/module/matchshotchart");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express"
  });
});

// 获取当前日期的比赛列表 中文数据来源stat-nba
router.post("/getMatchItems", (req, res, next) => {
  let date = req.body;
  MatchList.find(date).exec((err, matchItems) => {
    if (err) {
      console.log(err);
    } else {
      res.json(matchItems);
      console.log(matchItems);
    }
  });
});

// 获取单场比赛的常规统计数据 中文数据来源stat-nba
router.post("/getSingleMatchBasicDetail", (req, res, next) => {
  let url = req.body;
  BasicMatchDetail.find(url).exec((err, basicMatchDetail) => {
    if (err) {
      console.log(err);
    } else {
      res.json(basicMatchDetail);
      console.log(basicMatchDetail);
    }
  });
});

// 获取单场比赛的进阶统计数据 英文数据来源basketball-reference
router.post("/getSingleMatchAdvansDetail", (req, res, next) => {
  let url = req.body;
  AdvansMatchDetail.find(url).exec((err, advansMatchDetail) => {
    if (err) {
      console.log(err);
    } else {
      res.json(advansMatchDetail);
      console.log(advansMatchDetail);
    }
  });
});

// 获取球员生涯场均数据做雷达图渲染 中文数据来源stat-nba
router.post("/getSinglePlayerSeasonAvg", (req, res, next) => {
  let cnName = req.body;
  PlayerAverageData.find(cnName).exec((err, PlayerAverageData) => {
    if (err) {
      console.log(err);
    } else {
      res.json(PlayerAverageData);
      console.log(PlayerAverageData);
    }
  });
});

// 获取单场比赛的play-by-play时序数据 中文数据来源stat-nba
router.post("/getSingleMatchPlayByPlaycn", (req, res, next) => {
  let url = req.body;
  MatchPlayByPlaycn.find(url).exec((err, MatchPlayByPlaycn) => {
    if (err) {
      console.log(err);
    } else {
      res.json(MatchPlayByPlaycn);
      console.log(MatchPlayByPlaycn);
    }
  });
});

// 获取单场比赛的shotchart数据 英文数据来源basketball-reference
router.post("/getSingleMatchShotChart", (req, res, next) => {
  let url = req.body;
  MatchShotChart.find(url).exec((err, matchShotChart) => {
    if (err) {
      console.log(err);
    } else {
      res.json(matchShotChart);
      console.log(matchShotChart);
    }
  });
});

module.exports = router;
