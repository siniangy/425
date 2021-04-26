import React from "react";
import { Drawer, Input } from "antd";
import Part1 from "./part1/part1.js";
import Part2 from "./part2/part2.js";
import Part3 from "./part3/part3.js";
import { Segment, useDefault } from "segmentit";

const Search = Input.Search;
class MatchChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      part1Data: [],
      part2Data: [],
      part3Data: [],
      team1Name: "",
      team2Name: "",
      homeTeam: "", // 主队拼接basketball-reference的url
      dateParams: "", // 日期拼接basketball-reference的url
      drawerVisible: false, // 问答系统
      systemSearchValue: "", // 问答系统
      systemShowData: "" // 问答系统
    };
  }
  componentDidMount() { }
  componentWillMount() {
    // this.show(); 测试Segmentit
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.singleMatchData !== nextProps.singleMatchData) {
      if (nextProps.singleMatchData) {
        this.handleSingleMatchProps(nextProps.singleMatchData);
      }
      this.setState({
        dateParams: nextProps.dateParams
      }, () => {

      })
    }
    if (this.props.playByplayData !== nextProps.playByplayData) {
      if (nextProps.playByplayData) {
        this.handleSingleMatchPlayByPlayProps(nextProps.playByplayData);
      }
    }
  }
  // show() {
  //   const segmentit = useDefault(new Segment());
  //   const result = segmentit.doSegment("詹姆斯·哈登的本场表现");
  //   console.log(result);
  // }
  getKnowledgeMapData(url) {
    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      success: data => {
        this.setState(
          {
            systemShowData: data["data"]["desc"]
          },
          () => { }
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  handleSingleMatchProps(data) {
    this.setState(
      {
        part1Data: data,
        part2Data: data,
        team1Name: data[0]["team1Info"][1],
        team2Name: data[0]["team2Info"][1],
        homeTeam: this.getHomeTeam(data)
      },
      () => {

      }
    );
  }
  getHomeTeam(data) {
    let homeTeam = '';
    const changeDataUrl = {
      '布鲁克林篮网': 'BRK',
      '奥兰多魔术': 'ORL',
      '波士顿凯尔特人': 'BOS',
      '圣安东尼奥马刺': 'SAS',
      '克里夫兰骑士': 'CLE',
      '夏洛特黄蜂': 'CHO',
      '底特律活塞': 'DET',
      '洛杉矶快船': 'LAC',
      '金州勇士': 'GSW',
      '菲尼克斯太阳': 'PHO',
      '休斯顿火箭': 'HOU',
      '印第安纳步行者': 'IND',
      '犹他爵士': 'UTA',
      '洛杉矶湖人': 'LAL',
      '达拉斯独行侠': 'DAL',
      '孟菲斯灰熊': 'MEM',
      '亚特兰大老鹰': 'ATL',
      '密尔沃基雄鹿': 'MIL',
      '俄克拉荷马雷霆': 'OKC',
      '明尼苏达森林狼': 'MIN',
      '华盛顿奇才': 'WAS',
      '纽约尼克斯': 'NYK',
      '丹佛掘金': 'DEN',
      '波特兰开拓者': 'POR',
      '新奥尔良鹈鹕': 'NOP',
      '萨克拉门托国王': 'SAC',
      '迈阿密热火': 'MIA',
      '多伦多猛龙': 'TOR',
      '费城76人': 'PHI',
      '芝加哥公牛': 'CHI'
    }

    if (data[0]['team1Home'][1] === '客场') {
      homeTeam = changeDataUrl[data[0]['team2Info'][1]];
    } else {
      homeTeam = changeDataUrl[data[0]['team1Info'][1]];
    }
    return homeTeam;
  }
  handleSingleMatchPlayByPlayProps(data) {
    this.setState(
      {
        part3Data: data
      },
      () => {
      }
    );
  }
  handleQASystem() {
    this.setState(
      {
        drawerVisible: true
      },
      () => { }
    );
  }
  handleQASystemClose() {
    this.setState(
      {
        drawerVisible: false
      },
      () => { }
    );
  }
  handleSearchValue(value) {
    this.setState(
      {
        systemSearchValue: value
      },
      () => {
        console.log(this.state.systemSearchValue);
        this.getKnowledgeMapData(
          "https://api.ownthink.com/kg/knowledge?entity=" + value.toString()
        );
      }
    );
  }
  render() {
    const {
      part1Data,
      part2Data,
      part3Data,
      team1Name,
      team2Name
    } = this.state;
    const content = (
      <div>
        <p style={{ textIndent: "2em" }}>
          欢迎进入小Q的智能问答系统
        </p>
        <p style={{ textIndent: "2em" }}>
          这里是问题的答案（输入问题后点击搜索按钮）：
        </p>
        <p style={{ textIndent: "2em" }}>{this.state.systemShowData}</p>
      </div>
    );
    return (
      <div>
        <div>
          <Drawer
            title="欢迎进入425篮球知识问答系统"
            placement="left"
            closable={false}
            onClose={() => this.handleQASystemClose()}
            visible={this.state.drawerVisible}
          >
            <Search
              placeholder="input search text"
              onSearch={value => this.handleSearchValue(value)}
              enterButton
              style={{ marginBottom: "20px" }}
            />
            {content}
          </Drawer>
          <img
            src="/images/QA.png"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "20px",
              width: "150px",
              height: "150px",
              zIndex: "100",
              cursor: "pointer"
            }}
            onClick={() => this.handleQASystem()}
          />
        </div>
        <div>
          <Part1 data={part1Data} />
        </div>
        <div>
          <Part2 data={part2Data} dateParams={this.state.dateParams} homeTeam={this.state.homeTeam} />
        </div>
        <div>
          <Part3 data={part3Data} dateParams={this.state.dateParams} homeTeam={this.state.homeTeam} team1Name={team1Name} team2Name={team2Name} />
        </div>
      </div>
    );
  }
}

export default MatchChart;
