import React from "react";
import { Radio, Row, Col, Table, Select, Icon, Tooltip } from "antd";
import Part2Table from "./table.js";
import Part2BasicChart from "./basicChart.js";
import Part2AdvansChart from "./advansChart.js";
// var nameChange = require("./playerName.js");

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class Part2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team1Detail: [],
      team2Detail: [],
      team1Summary: [],
      team2Summary: [],
      team1Max: [],
      team2Max: [],
      team1ScoreMax: [],
      team1ReboundMax: [],
      team1AssistMax: [],
      team2ScoreMax: [],
      team2ReboundMax: [],
      team2AssistMax: [],
      team1Name: "",
      team2Name: "",
      team1SummaryChart: [],
      team2SummaryChart: [],
      teamDefaultValue: "a",
      teamDataChangeDefaultValue: "basic", // 球队基础数据和进阶数据转换
      playerDataChangeDefaultValue: "Pbasic", //球员基础数据和进阶数据转换
      team1AdvansSummary: [], // teamA进阶数据
      team2AdvansSummary: [], // teamB进阶数据
      player1AdvansSummary: [], // playerA进阶数据
      player2AdvansSummary: [], // playerB进阶数据
      width: -1
    };
  }
  componentDidMount() {
    this.handleReSize();
    window.addEventListener("resize", this.handleReSize.bind(this));
  }
  componentWillMount() {
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleReSize.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      if (nextProps.data) {
        this.handleProps(nextProps.data);
        // console.log(this.getAdvansDataUrl(nextProps.dateParams, nextProps.homeTeam))
        this.getAdvansData(this.getAdvansDataUrl(nextProps.dateParams, nextProps.homeTeam))
      }
    }
  }
  getAdvansDataUrl(date, team) {
    // https://www.basketball-reference.com/boxscores/201903010ATL.html
    let res = '';
    res = 'https://www.basketball-reference.com/boxscores/' + date.split('-').join('') + '0' + team + '.html';
    return res.toString();
  }
  // 获取进阶数据
  getAdvansData(data) {
    const postData = {
      url: data
    }
    $.ajax({
      url: '/getSingleMatchAdvansDetail',
      type: "post",
      dataType: "json",
      data: postData,
      success: res => {
        let test1 = this.handleAdvansPlayerData(
          res[0]["team1AdvansDetail"]
        ).map(item => {
          return this.changeIntoJson(item);
        });
        let test2 = this.handleAdvansPlayerData(
          res[0]["team2AdvansDetail"]
        ).map(item => {
          return this.changeIntoJson(item);
        });
        this.setState(
          {
            team1AdvansSummary: this.handleAdvansTeamData(
              res[0]["team1AdvansSummary"][0]
            ),
            team2AdvansSummary: this.handleAdvansTeamData(
              res[0]["team2AdvansSummary"][0]
            ),
            player1AdvansSummary: test1,
            player2AdvansSummary: test2
          },
          () => {
            // console.log(this.state.player1AdvansSummary);
          }
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  handleAdvansTeamData(data) {
    let resA = [];
    for (let i = 0; i < data.length; i++) {
      if ((i >= 2 && i <= 5) || (i >= 12 && i <= 15)) {
        resA.push(data[i]);
      }
    }
    return resA;
  }
  handleAdvansPlayerData(data) {
    let resB = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].length >= 5) {
        // data[i][0] = nameChange[data[i][0]]; // 球员中英文转换
        resB.push(data[i]);
      }
    }
    return resB;
  }
  handleReSize() {
    let test = document.getElementById("part2");
    this.setState({ width: test.clientWidth });
  }
  selectData(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      if (i == 1 || i == 4 || i == 7 || i == 11 || (i >= 14 && i < 19)) {
        res.push(data[i] * -1);
      } else {
        continue;
      }
    }
    return res;
  }

  selectData2(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      if (i == 1 || i == 4 || i == 7 || i == 11 || (i >= 14 && i < 19)) {
        res.push(data[i]);
      } else {
        continue;
      }
    }
    return res;
  }
  changeIntoAll(data) {
    if (data[3].indexOf("%") == -1) data.splice(3, 0, "0%");
    if (data[6].indexOf("%") == -1) data.splice(6, 0, "0%");
    if (data[9].indexOf("%") == -1) data.splice(9, 0, "0%");
    if (data[12].indexOf("%") == -1) data.splice(12, 0, "0%");
    return data;
  }
  changeIntoSummaryNumber(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      res.push(parseInt(data[i]));
    }
    return res;
  }
  changeIntoNumber(data) {
    let res = data.map((item, index) => {
      if (index == 0) return item.toString();
      else {
        if (item.indexOf("%") != -1) return parseInt(item) / 100;
        else return parseInt(item);
      }
    });
    return res;
  }

  changeIntoJson(data) {
    let json = {
      key: Math.random() * 100
    };
    for (let i = 0; i < data.length; i++) {
      json[i] = data[i];
    }
    return json;
  }

  selectMax(data) {
    let scoreMax = data[0][21];
    let reboundMax = data[0][13];
    let asssitMax = data[0][16];
    let target = [];
    let score = 0;
    let rebound = 0;
    let asssit = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i][21] > scoreMax) {
        score = i;
        scoreMax = data[i][21];
      } else {
        continue;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][13] > reboundMax) {
        rebound = i;
        reboundMax = data[i][13];
      } else {
        continue;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][16] > asssitMax) {
        asssit = i;
        asssitMax = data[i][13];
      } else {
        continue;
      }
    }
    target = [score, rebound, asssit];
    return target;
  }
  handleProps(data) {
    let team1Detail = data[0]["team1Detail"].map(item => {
      return this.changeIntoJson(
        this.changeIntoNumber(this.changeIntoAll(item))
      );
    });
    let team2Detail = data[0]["team2Detail"].map(item => {
      return this.changeIntoJson(
        this.changeIntoNumber(this.changeIntoAll(item))
      );
    });
    let team1Max = this.selectMax(
      data[0]["team1Detail"].map(item => {
        return this.changeIntoNumber(this.changeIntoAll(item));
      })
    );
    let team2Max = this.selectMax(
      data[0]["team2Detail"].map(item => {
        return this.changeIntoNumber(this.changeIntoAll(item));
      })
    );

    let team1SummaryChart = this.selectData(
      this.changeIntoSummaryNumber(data[0]["team1Summary"][0])
    );
    let team2SummaryChart = this.selectData2(
      this.changeIntoSummaryNumber(data[0]["team2Summary"][0])
    );
    this.setState(
      {
        team1Detail: team1Detail,
        team2Detail: team2Detail,
        team1Summary: data[0]["team1Summary"],
        team2Summary: data[0]["team2Summary"],
        team1Name: data[0]["team1Info"][1],
        team2Name: data[0]["team2Info"][1],
        team1Max: team1Max,
        team2Max: team2Max,
        team1ScoreMax: [
          team1Detail[team1Max[0]]['0'],
          team1Detail[team1Max[0]]['21']
        ],
        team1ReboundMax: [
          team1Detail[team1Max[1]]['0'],
          team1Detail[team1Max[1]]['13']
        ],
        team1AssistMax: [
          team1Detail[team1Max[2]]['0'],
          team1Detail[team1Max[2]]['16']
        ],
        team2ScoreMax: [
          team2Detail[team2Max[0]]['0'],
          team2Detail[team2Max[0]]['21']
        ],
        team2ReboundMax: [
          team2Detail[team2Max[1]]['0'],
          team2Detail[team2Max[1]]['13']
        ],
        team2AssistMax: [
          team2Detail[team2Max[2]]['0'],
          team2Detail[team2Max[2]]['16']
        ],
        team1SummaryChart: team1SummaryChart,
        team2SummaryChart: team2SummaryChart
      },
      () => {

      }
    );
  }
  handleSelect(e) {
    this.setState({ teamDefaultValue: e });
  }
  handleTeamDataChange(e) {
    this.setState(
      {
        teamDataChangeDefaultValue: e.target.value
      },
      () => {
        // console.log(this.state.teamDataChangeDefaultValue);
      }
    );
  }
  handlePlayerDataChange(e) {
    this.setState(
      {
        playerDataChangeDefaultValue: e.target.value
      },
      () => {
        // console.log(this.state.playerDataChangeDefaultValue);
      }
    );
  }
  render() {
    const {
      team1Detail,
      team2Detail,
      team1Summary,
      team2Summary,
      team1Name,
      team2Name,
      teamDefaultValue,
      team1Max,
      team2Max,
      team1ScoreMax,
      team1ReboundMax,
      team1AssistMax,
      team2ScoreMax,
      team2ReboundMax,
      team2AssistMax,
      team1SummaryChart,
      team2SummaryChart
    } = this.state;
    const advansContent = (
      <div>
        <div>
          <b>Advanced Box Score Stats</b>
        </div>
        <br />
        <div>
          <b>MP -- Minutes Played</b>
        </div>
        <div>
          <b>TS% -- True Shooting Percentage</b> <br />A measure of shooting
          efficiency that takes into account 2-point field goals, 3-point field
          goals, and free throws.
        </div>
        <div>
          <b>eFG% -- Effective Field Goal Percentage</b> <br />
          This statistic adjusts for the fact that a 3-point field goal is worth
          one more point than a 2-point field goal.
        </div>
        <div>
          <b>3PAr -- 3-Point Attempt Rate</b> <br />
          Percentage of FG Attempts from 3-Point Range
        </div>
        <div>
          <b>FTr -- Free Throw Attempt Rate</b> <br />
          Number of FT Attempts Per FG Attempt
        </div>
        <div>
          <b>ORB% -- Offensive Rebound Percentage</b> <br />
          An estimate of the percentage of available offensive rebounds a player
          grabbed while he was on the floor.
        </div>
        <div>
          <b>DRB% -- Defensive Rebound Percentage</b> <br />
          An estimate of the percentage of available defensive rebounds a player
          grabbed while he was on the floor.
        </div>
        <div>
          <b>TRB% -- Total Rebound Percentage</b> <br />
          An estimate of the percentage of available rebounds a player grabbed
          while he was on the floor.
        </div>
        <div>
          <b>AST% -- Assist Percentage</b> <br />
          An estimate of the percentage of teammate field goals a player
          assisted while he was on the floor.
        </div>
        <div>
          <b>STL% -- Steal Percentage</b> <br />
          An estimate of the percentage of opponent possessions that end with a
          steal by the player while he was on the floor.
        </div>
        <div>
          <b>BLK% -- Block Percentage</b> <br />
          An estimate of the percentage of opponent two-point field goal
          attempts blocked by the player while he was on the floor.
        </div>
        <div>
          <b>TOV% -- Turnover Percentage</b> <br />
          An estimate of turnovers committed per 100 plays.
        </div>
        <div>
          <b>USG% -- Usage Percentage</b> <br />
          An estimate of the percentage of team plays used by a player while he
          was on the floor.
        </div>
        <div>
          <b>ORtg -- Offensive Rating</b> <br />
          An estimate of points produced (players) or scored (teams) per 100
          possessions
        </div>
        <div>
          <b>DRtg -- Defensive Rating</b> <br />
          An estimate of points allowed per 100 possessions
        </div>
      </div>
    );
    const arr = team1Detail;
    const chart =
      this.state.teamDataChangeDefaultValue == "basic" ? (
        <Part2BasicChart
          team1Name={team1Name}
          team2Name={team2Name}
          team1SummaryChart={team1SummaryChart}
          team2SummaryChart={team2SummaryChart}
          width={this.state.width}
        />
      ) : (
          <Part2AdvansChart
            team1Name={team1Name}
            team2Name={team2Name}
            team1AdvansSummary={this.state.team1AdvansSummary}
            team2AdvansSummary={this.state.team2AdvansSummary}
            width={this.state.width}
          />
        );
    const dataSource = [
      {
        key: "0",
        0: "得分",
        1: team1ScoreMax,
        2: team2ScoreMax
      },
      {
        key: "1",
        0: "篮板",
        1: team1ReboundMax,
        2: team2ReboundMax
      },
      {
        key: "2",
        0: "助攻",
        1: team1AssistMax,
        2: team2AssistMax
      }
    ];
    const columns = [
      {
        title: "",
        dataIndex: "0",
        key: "0"
      },
      {
        title: team1Name,
        dataIndex: "1",
        key: "1",
        render: text => (
          <div>
            <p
              style={{
                fontSize: "14px"
              }}
            >
              {text[0]}
            </p>
            <b
              style={{
                fontSize: "14px"
              }}
            >
              {text[1]}
            </b>
          </div>
        )
      },
      {
        title: team2Name,
        dataIndex: "2",
        key: "2",
        render: text => (
          <div>
            <p
              style={{
                fontSize: "14px"
              }}
            >
              {text[0]}
            </p>
            <b
              style={{
                fontSize: "14px"
              }}
            >
              {text[1]}
            </b>
          </div>
        )
      }
    ];
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
        <Row>
          <Col
            span={12}
            id="part2"
            style={{
              paddingRight: "20px",
              paddingTop: "20px",
              minWidth: "550px"
            }}
          >
            <RadioGroup
              onChange={e => this.handleTeamDataChange(e)}
              defaultValue="basic"
            >
              <RadioButton value="basic">基础数据</RadioButton>
              <RadioButton value="advans">进阶数据</RadioButton>
            </RadioGroup>
            <span style={{ marginLeft: "15px" }}>
              <Tooltip title={advansContent} placement="right" overlayStyle={{ maxWidth: "800px" }}>
                <Icon
                  type="question-circle"
                  theme="twoTone"
                  style={{ fontSize: "20px" }}
                />
              </Tooltip>
            </span>
            {chart}
          </Col>
          <Col
            span={12}
            style={{
              paddingTop: "20px",
              minWidth: "550px"
            }}
          >
            <h3>各项最佳</h3>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Col>
        </Row>
        <div
          style={{
            margin: "10px auto"
          }}
        >
          <Select
            onChange={e => this.handleSelect(e)}
            defaultValue="a"
            style={{ marginRight: "15px" }}
          >
            <Option value="a">{team1Name}</Option>
            <Option value="b">{team2Name}</Option>
          </Select>
          <RadioGroup
            onChange={e => this.handlePlayerDataChange(e)}
            defaultValue="Pbasic"
          >
            <Radio value="Pbasic">基础数据</Radio>
            <Radio value="Padvan">进阶数据</Radio>
          </RadioGroup>
        </div>
        <Part2Table
          teamDetail={
            teamDefaultValue == "a"
              ? this.state.playerDataChangeDefaultValue == "Pbasic"
                ? team1Detail
                : this.state.player1AdvansSummary
              : this.state.playerDataChangeDefaultValue == "Pbasic"
                ? team2Detail
                : this.state.player2AdvansSummary
          }
        />
      </div>
    );
  }
}

export default Part2;
