import React from "react";
import { Popover } from "antd";

class Part3Chart3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUrl: "",
      team1Name: "",
      team2Name: "",
      team1ChartData: [],
      team2ChartData: [],
      team1Img: "",
      team2Img: "",
      iconSelect: false,
      quarterSelect: "",
      shotSelect: ""
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.dataUrl != nextProps.dataUrl ||
      this.props.iconSelect != nextProps.iconSelect ||
      this.props.quarterSelect != nextProps.quarterSelect ||
      this.props.shotSelect != nextProps.shotSelect
    ) {
      if (nextProps.dataUrl) {
        this.setState(
          {
            team1Name: nextProps.team1Name,
            team2Name: nextProps.team2Name,
            dataUrl: nextProps.dataUrl,
            iconSelect: nextProps.iconSelect,
            quarterSelect: nextProps.quarterSelect,
            shotSelect: nextProps.shotSelect
          },
          () => {
            this.getSingleMatchShot(
              this.state.team1Name,
              this.state.team2Name,
              this.state.dataUrl,
              this.state.quarterSelect,
              this.state.shotSelect,
              this.state.iconSelect
            );
          }
        );
      }
    }
  }

  getSingleMatchShot(team1Name, team2Name, data, quarter, shot, icon) {
    const changeImgurl = {
      '布鲁克林篮网': 'BKN',
      '奥兰多魔术': 'ORL',
      '波士顿凯尔特人': 'BOS',
      '圣安东尼奥马刺': 'SAS',
      '克里夫兰骑士': 'CLE',
      '夏洛特黄蜂': 'CHA',
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
      '新奥尔良鹈鹕': 'NOH',
      '萨克拉门托国王': 'SAC',
      '迈阿密热火': 'MIA',
      '多伦多猛龙': 'TOR',
      '费城76人': 'PHI',
      '芝加哥公牛': 'CHI'
    }
    const postData = {
      url: data
    };
    $.ajax({
      url: "/getSingleMatchShotChart",
      type: "post",
      dataType: "json",
      data: postData,
      success: data => {
        let chart1Data = data[0]["team1ChartData"];
        let chart2Data = data[0]["team2ChartData"];
        let team1Img =
          "http://www.stat-nba.com/image/teamImage/" +
          changeImgurl[team1Name] +
          ".gif";
        let team2Img =
          "http://www.stat-nba.com/image/teamImage/" +
          changeImgurl[team2Name] +
          ".gif";
        let data1 = chart1Data.filter((item, index) => {
          return item[2].indexOf(quarter) != -1;
        });
        let data2 = chart2Data.filter((item, index) => {
          return item[2].indexOf(quarter) != -1;
        });
        if (shot === "made") {
          data1 = data1.filter((item, index) => {
            return item[2].indexOf("made") != -1;
          });
          data2 = data2.filter((item, index) => {
            return item[2].indexOf("made") != -1;
          });
        } else if (shot === "miss") {
          data1 = data1.filter((item, index) => {
            return item[2].indexOf("missed") != -1;
          });
          data2 = data2.filter((item, index) => {
            return item[2].indexOf("missed") != -1;
          });
        } else {
          data1 = data1;
          data2 = data2;
        }
        if (icon === true) {
          this.setState({
            team1ChartData: [],
            team2ChartData: [],
            team1Img: team1Img,
            team2Img: team2Img
          });
          this.getCourtLeftHeatmap(data1);
          this.getCourtRightHeatmap(data2);
        } else {
          $(".heatmap-canvas").remove();
          this.setState({
            team1ChartData: data1,
            team2ChartData: data2,
            team1Img: team1Img,
            team2Img: team2Img
          });
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }
  getCourtLeftHeatmap(data) {
    $(".heatmap-canvas").remove();
    const team1ChartData = data;
    var heatmapInstance = window.h337.create({
      container: document.querySelector("#courtLeft"),
      maxOpacity: 0.85,
      minOpacity: 0,
      blur: 1
      // gradient: {
      //   '.5': 'blue',
      //   '.8': 'green',
      //   '.95': 'white'
      // }
    });
    var points = [];
    var len = team1ChartData.length;
    while (len--) {
      var point = {
        x:
          parseFloat(
            team1ChartData[len][1]
              .split(";")[1]
              .split(":")[1]
              .split("p")[0]
          ) + 4,
        y:
          parseFloat(
            team1ChartData[len][1]
              .split(";")[0]
              .split(":")[1]
              .split("p")[0]
          ) + 10.5,
        value: 1 // 每个投篮点的value应该一样
      };
      points.push(point);
    }
    var max = 1;
    var data = {
      max: max,
      data: points
    };
    heatmapInstance.setData(data);
  }
  getCourtRightHeatmap(data) {
    const team2ChartData = data;
    var heatmapInstance = window.h337.create({
      container: document.querySelector("#courtRight"),
      maxOpacity: 0.85,
      minOpacity: 0,
      blur: 1
    });
    var points = [];
    var len = team2ChartData.length;
    while (len--) {
      var point = {
        x:
          parseFloat(
            team2ChartData[len][1]
              .split(";")[1]
              .split(":")[1]
              .split("p")[0]
          ) + 4,
        y:
          parseFloat(
            team2ChartData[len][1]
              .split(";")[0]
              .split(":")[1]
              .split("p")[0]
          ) + 10.5,
        value: 1
      };
      points.push(point);
    }
    var max = 1;
    var data = {
      max: max,
      data: points
    };
    heatmapInstance.setData(data);
  }
  handle1Index(index) {
    this.props.handleIndex(index);
  }
  handle2Index(index) {
    this.props.handleIndex(index);
  }
  render() {
    const { team1ChartData, team2ChartData, team1Img, team2Img } = this.state;
    const item1s = team1ChartData.map((item, index) => {
      let color = {
        color: "lightblue"
      };
      let style1 = {
        top: item[1].split(";")[0].split(":")[1],
        left: item[1].split(";")[1].split(":")[1],
        position: "absolute"
      };
      let target = item[3];
      let num = [10, 12, 14];
      let flag = (num.indexOf(index) != -1 && this.state.dataUrl === "https://www.basketball-reference.com/boxscores/shot-chart/201903010ATL.html" && this.state.quarterSelect === "quarter") ? true : false;
      let style2 = {
        background:
          target == "×"
            ? "rgb(245,22,56)"
            : flag == true
              ? "blue"
              : "rgb(106,212,29)",
        cursor: "pointer",
        width: flag == true ? "20px" : "10px",
        height: flag == true ? "20px" : "10px",
        borderRadius: "50%",
        marginTop: "5px" // 修正div
      };
      let p1 = item[2].split("<br>")[0];
      let p2 = item[2].split("<br>")[1];
      let content = (
        <div>
          <p
            style={{
              margin: "0px auto"
            }}
          >
            {p1}
          </p>
          <p
            style={{
              margin: "0px auto"
            }}
          >
            {p2}
          </p>
        </div>
      );
      return (
        <Popover content={content} key={index}>
          <div style={style1}>
            <div style={style2} onClick={() => this.handle1Index(index)} />
          </div>
        </Popover>
      );
    });
    const item2s = team2ChartData.map((item, index) => {
      let color = {
        color: "lightblue"
      };
      let style1 = {
        top: item[1].split(";")[0].split(":")[1],
        left: item[1].split(";")[1].split(":")[1],
        position: "absolute"
      };
      let target = item[3];
      let num = [1, 8, 9];
      let flag = (num.indexOf(index) != -1 && this.state.dataUrl === "https://www.basketball-reference.com/boxscores/shot-chart/201903010ATL.html" && this.state.quarterSelect === "quarter") ? true : false;
      let style2 = {
        background:
          target == "×"
            ? "rgb(245,22,56)"
            : flag == true
              ? "purple"
              : "rgb(106,212,29)",
        cursor: "pointer",
        width: flag == true ? "20px" : "10px",
        height: flag == true ? "20px" : "10px",
        borderRadius: "50%",
        marginTop: "5px" // 修正div
      };
      let p1 = item[2].split("<br>")[0];
      let p2 = item[2].split("<br>")[1];
      let content = (
        <div>
          <p
            style={{
              margin: "0px auto"
            }}
          >
            {p1}
          </p>
          <p
            style={{
              margin: "0px auto"
            }}
          >
            {p2}
          </p>
        </div>
      );
      return (
        <Popover content={content} key={index}>
          <div style={style1}>
            <div style={style2} onClick={() => this.handle2Index(index)} />
          </div>
        </Popover>
      );
    });
    return (
      <div>
        <div>
          <div
            style={{
              width: "1000px",
              height: "500px",
              margin: "0px auto",
              position: "relative"
            }}
          >
            <img
              src={team1Img}
              style={{
                position: "absolute",
                bottom: "35px",
                left: "32%",
                width: "100px",
                height: "66px",
                zIndex: "999"
              }}
            />
            <img
              src={team2Img}
              style={{
                position: "absolute",
                bottom: "35px",
                right: "35%",
                width: "100px",
                height: "66px",
                zIndex: "999"
              }}
            />
            <div
              id="courtLeft"
              style={{
                width: "500px",
                height: "472px",
                position: "relative",
                display: "inline-block",
                transform: "rotate(-90deg)",
                marginRight: "-28px"
              }}
            >
              <img src="/images/nbahalfcourt.png" style={{}} alt="team1Img" />{" "}
              {item1s}
            </div>
            <div
              id="courtRight"
              style={{
                width: "500px",
                height: "472px",
                position: "relative",
                display: "inline-block",
                transform: "rotate(90deg)"
              }}
            >
              <img src="/images/nbahalfcourt.png" style={{}} alt="team2Img" />{" "}
              {item2s}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Part3Chart3;
