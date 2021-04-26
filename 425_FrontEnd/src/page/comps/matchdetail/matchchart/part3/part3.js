import React from "react";
import { Radio, Divider, Row, Col, Icon, Select } from "antd";
import { Player } from "video-react";
import Chart1 from "./assistChart.js";
import Chart2 from "./eventsChart.js";
import Chart3 from "./positionChart.js";
import "./video.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
export default class Part3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointDiff: [],
      diffLength: [],
      team1Name: "",
      team2Name: "",
      team1Players: [],
      team1Relation: [],
      team2Players: [],
      team2Relation: [],
      defaultValue: "a",
      defaultIconStyle: false,
      defaultEventsSelectValue: "All",
      defaultQuarterSelectedValue: "quarter",
      defaultShotSelectedValue: "all",
      playbyplayData: [],
      templateEventsData: [],
      dataUrl: '', // 拼接url传参
      index: -1,
      videoSrc: "", // 测试地址
      width: -1
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.videoSrc != prevState.videoSrc) {
      this.refs.player.load();
      this.refs.player.play();
    }
  }
  componentDidMount() {
    this.handleReSize();
    window.addEventListener("resize", this.handleReSize.bind(this));
  }
  componentWillMount() { }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleReSize.bind(this));
  }
  handleReSize() {
    let test = document.getElementById("part3");
    this.setState({ width: test.clientWidth });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      if (nextProps.data) {
        this.handleProps(nextProps.data);
      }
      this.setState({
        dataUrl: this.getAdvansDataUrl(nextProps.dateParams, nextProps.homeTeam),
        videoSrc: ""
      }, () => {
        // console.log(this.state.dataUrl)
      })
    }
    if (
      this.props.team1Name !== nextProps.team1Name &&
      this.props.team2Name !== nextProps.team2Name
    ) {
      if (nextProps.team1Name && nextProps.team2Name) {
        this.handleNameProps(nextProps.team1Name, nextProps.team2Name);
      }
    }
  }
  getAdvansDataUrl(date, team) {
    // https://www.basketball-reference.com/boxscores/shot-chart/201903010BRK.html
    let res = '';
    res = 'https://www.basketball-reference.com/boxscores/shot-chart/' + date.split('-').join('') + '0' + team + '.html';
    return res.toString();
  }
  changePointDiff(array) {
    let target = [];
    for (let i = 0; i < array.length; i++) {
      let a = parseInt(array[i][3].split("-")[0]);
      let b = parseInt(array[i][3].split("-")[1]);
      target.push(a - b);
    }
    return target;
  }
  changeDiffLength(array) {
    let length = [];
    for (let i in array) {
      length.push(i);
    }
    return length;
  }
  changeRelation(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let k = 1;
      for (let j = i + 1; j < data.length; j++) {
        if (data[j][0] == data[i][0] && data[j][1] == data[i][1]) {
          k++;
        }
      }
      data[i].push(k, 1);
      res.push(data[i]);
    }
    return res;
  }
  changePlayers(data) {
    return [...new Set(data)];
  }
  handleNameProps(data1, data2) {
    this.setState(
      {
        team1Name: data1,
        team2Name: data2
      },
      () => { }
    );
  }
  handleProps(data) {
    let arr = data[0]["quarter1"].concat(
      data[0]["quarter2"],
      data[0]["quarter3"],
      data[0]["quarter4"]
    );
    let team1Info = arr.filter((item, index) => {
      if (item[2].indexOf("助攻+1") != -1) {
        return item;
      }
    });
    let m = [];
    let n = [];
    for (let i in team1Info) {
      if (team1Info[i][1].indexOf('命中') !== -1) {
        if (team1Info[i][1].indexOf('篮板') !== -1) { // 处理“xxx抢到进攻篮板xxx命中三分xxx助攻队友”这种非常规字段
          let a1 = team1Info[i][1].split('篮板')[1].split("命中")[0];
          let b1 = team1Info[i][1].split('篮板')[1].split("分")[1].split("助攻")[0];
          m.push(a1, b1);
          n.push([b1, a1]);
        } else {
          let a1 = team1Info[i][1].split("命中")[0];
          let b1 = team1Info[i][1].split("分")[1].split("助攻")[0];
          m.push(a1, b1);
          n.push([b1, a1]);
        }
      } else {    // 处理“尼古拉-乌切维奇助攻队友”这种非常规字段，自己助攻自己吧！！
        let a1 = team1Info[i][1].split('助攻')[0];
        let b1 = team1Info[i][1].split('助攻')[0];
        m.push(a1, b1);
        n.push([b1, a1]);
      }
    }
    let team1Players = this.changePlayers(m);
    let team1Relation = this.changeRelation(n);

    let team2Info = arr.filter((item, index) => {
      if (item[4].indexOf("助攻+1") != -1) {
        return item;
      }
    });
    let k = [];
    let j = [];
    for (let i in team2Info) {
      if (team2Info[i][5].indexOf('命中') !== -1) {
        if (team2Info[i][5].indexOf('篮板') !== -1) { // 处理“xxx抢到进攻篮板xxx命中三分xxx助攻队友”这种非常规字段
          let a2 = team2Info[i][5].split('篮板')[1].split("命中")[0];
          let b2 = team2Info[i][5].split('篮板')[1].split("分")[1].split("助攻")[0];
          k.push(a2, b2);
          j.push([b2, a2]);
        } else {
          let a2 = team2Info[i][5].split("命中")[0];
          let b2 = team2Info[i][5].split("分")[1].split("助攻")[0];
          k.push(a2, b2);
          j.push([b2, a2]);
        }
      } else {    // 处理“尼古拉-乌切维奇助攻队友”这种非常规字段，自己助攻自己吧！！
        let a2 = team2Info[i][5].split('助攻')[0];
        let b2 = team2Info[i][5].split('助攻')[0];
        k.push(a2, b2);
        j.push([b2, a2]);
      }
    }
    let team2Players = this.changePlayers(k);
    let team2Relation = this.changeRelation(j);

    let pointDiff = this.changePointDiff(arr);
    let diffLength = this.changeDiffLength(arr);
    this.setState(
      {
        playbyplayData: arr,
        templateEventsData: arr,
        pointDiff: pointDiff,
        diffLength: diffLength,
        team1Players: team1Players,
        team1Relation: team1Relation,
        team2Players: team2Players,
        team2Relation: team2Relation
      },
      () => { }
    );
  }
  handleButton(e) {
    this.setState(
      {
        defaultValue: e.target.value
      },
      () => { }
    );
  }
  handleClick() {
    const defaultIconStyle = !this.state.defaultIconStyle;
    this.setState(
      {
        defaultIconStyle: defaultIconStyle
      },
      () => {
        // console.log(this.state.defaultIconStyle)
      }
    );
  }
  handleQuarterChange(e) {
    this.setState(
      {
        defaultQuarterSelectedValue: e
      },
      () => {
        // console.log(this.state.defaultQuarterSelectedValue)
      }
    );
  }
  handleShotChange(e) {
    this.setState({
      defaultShotSelectedValue: e
    });
  }
  changeEvents(array, value) {
    var changeJson = {
      Assit: "助攻",
      Rebound: "篮板",
      Score: "得分",
      Iron: "打铁"
    };
    let target = changeJson[value];
    let res = [];
    if (value == "All") {
      res = array;
    } else {
      res = array.filter((item, index) => {
        return item[2].indexOf(target) != -1 || item[4].indexOf(target) != -1;
      });
    }
    let pointDiff = this.changePointDiff(res);
    let diffLength = this.changeDiffLength(res);
    this.setState({
      playbyplayData: res,
      pointDiff: pointDiff,
      diffLength: diffLength
    });
  }
  handleEventsChange(e) {
    const array = this.state.templateEventsData;
    this.setState(
      {
        defaultEventsSelectValue: e
      },
      () => {
        this.changeEvents(array, this.state.defaultEventsSelectValue);
      }
    );
  }
  handleIndex(e) {
    let src = "";
    // console.log(e)
    let num1 = [10, 12, 14]; // 公牛测试
    let flag1 = num1.indexOf(e) != -1 ? true : false;
    let num2 = [1, 8, 9]; // 老鹰测试
    let flag2 = num2.indexOf(e) != -1 ? true : false;
    if (flag1 === true) {
      src = "/testVideos/1/1-" + e.toString() + ".webm"
    } else if (flag2 === true) {
      src = "/testVideos/2/2-" + e.toString() + ".webm"
    } else {

    }
    this.setState({
      index: e,
      videoSrc: src
    });
  }
  render() {
    const {
      team1Players,
      team1Relation,
      team2Players,
      team2Relation,
      defaultValue,
      defaultIconStyle,
      defaultQuarterSelectedValue,
      defaultShotSelectedValue
    } = this.state;
    const { team1Name, team2Name } = this.props;
    const eventsLength = this.state.playbyplayData.length;
    let style = {
      color: defaultIconStyle === false ? "#999" : "rgb(24,144,255)",
      cursor: "pointer",
      marginLeft: "8px"
    };
    return (
      <div
        style={{
          border: "2px solid rgba(240,242,245,1)",
          borderRadius: "10px",
          padding: "10px",
          minHeight: "150px",
          marginTop: "20px"
        }}
      >
        <Row
          style={{
            overflowX: "auto",
            overflowY: "hidden"
          }}>
          <h3>
            时序事件过滤
            <span style={{ marginLeft: "15px" }}>
              <Select
                defaultValue="All Events"
                style={{
                  width: 120
                }}
                onChange={e => this.handleEventsChange(e)}
              >
                <Option value="All">All Events</Option>
                <Option value="Assit">Assit Events</Option>
                <Option value="Rebound">Rebound Events</Option>
                <Option value="Score">Score Events</Option>
                <Option value="Iron">Iron Events</Option>
              </Select>
            </span>
            <span style={{ float: "right" }}>
              {eventsLength} Events Lighted
            </span>
          </h3>
          <Chart2
            pointDiff={this.state.pointDiff}
            diffLength={this.state.diffLength}
            eventDetail={this.state.playbyplayData}
            width={this.state.width}
          />
        </Row>
        <Row
          style={{
            overflowX: "auto",
            overflowY: "hidden"
          }}
        >
          <Col
            span={24}
            style={{
              paddingRight: "20px",
              paddingTop: "20px"
            }}
          >
            <h3>
              投篮点分析
              <Icon
                type="heat-map"
                style={style}
                onClick={() => this.handleClick()}
              />
            </h3>
            <div
              style={{
                marginBottom: "20px"
              }}
            >
              <Select
                defaultValue="quarter"
                style={{
                  width: 120
                }}
                onChange={e => this.handleQuarterChange(e)}
              >
                <Option value="quarter">All Quarters</Option>
                <Option value="1st">1st Quarter</Option>
                <Option value="2nd">2nd Quarter</Option>
                <Option value="3rd">3rd Quarter</Option>
                <Option value="4th">4th Quarter</Option>
              </Select>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue="all"
                style={{
                  width: 120
                }}
                onChange={e => this.handleShotChange(e)}
              >
                <Option value="all">All Shots</Option>
                <Option value="made">Made Shots</Option>
                <Option value="miss">Miss Shots</Option>
              </Select>
            </div>
            <Chart3
              iconSelect={defaultIconStyle}
              quarterSelect={defaultQuarterSelectedValue}
              shotSelect={defaultShotSelectedValue}
              handleIndex={this.handleIndex.bind(this)}
              dataUrl={this.state.dataUrl}
              team1Name={this.state.team1Name}
              team2Name={this.state.team2Name}
            />
          </Col>
        </Row>
        <Row>
          <Col
            span={12}
            style={{
              paddingRight: "20px",
              paddingTop: "20px",
              minWidth: "550px"
            }}
            id="part3"
          >
            <h3 style={{}}>
              球队助攻关系
              <span style={{ marginLeft: "15px" }}>
                <RadioGroup
                  onChange={e => this.handleButton(e)}
                  defaultValue="a"
                  style={{}}
                >
                  <RadioButton value="a">{team1Name}</RadioButton>
                  <RadioButton value="b">{team2Name}</RadioButton>
                </RadioGroup>
              </span>
            </h3>
            <Chart1
              players={defaultValue == "a" ? team1Players : team2Players}
              relation={defaultValue == "a" ? team1Relation : team2Relation}
              width={this.state.width}
            />
          </Col>
          <Col
            span={12}
            style={{
              paddingRight: "20px",
              paddingTop: "20px",
              minWidth: "550px"
            }}
            id="test"
          >
            <h3>视频测试</h3>
            <div style={{ marginTop: "30px", minHeight: "400px" }}>
              <Player ref="player" videoId="video-1" poster="/images/news.jpg">
                <source src={this.state.videoSrc} />
              </Player>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
