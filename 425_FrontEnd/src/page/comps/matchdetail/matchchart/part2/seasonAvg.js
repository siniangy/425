import React from "react";

class SeasonAvgChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: "",
      targetDetail: [],
      targetAvg: []
    };
  }
  componentDidMount() { }
  componentWillMount() {
    // 处理球员本场数据
    let dataMatch = this.props.targetDetail[0];
    let data1 = [];
    for (let key in dataMatch) {
      if (key == 3 || key == 13 || (key >= 16 && key <= 21)) {
        data1.push(dataMatch[key]);
      }
    }
    // 处理球员场均数据在Avg方法里，div的id是index！！
    this.getSeasonAvgData(this.props.target, data1, this.props.id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.target != nextProps.target) {
      if (nextProps.target) {
        // 处理球员本场数据
        let dataMatch = nextProps.targetDetail[0];
        let data1 = [];
        for (let key in dataMatch) {
          if (key == 3 || key == 13 || (key >= 16 && key <= 21)) {
            data1.push(dataMatch[key]);
          }
        }
        // 处理球员场均数据在Avg方法里，div的id是index！！
        this.getSeasonAvgData(nextProps.target, data1, nextProps.id);
      }
    }
  }
  getSeasonAvgData(data, data1, id) {
    const that = this;
    let postData =
      data == "科克-辛里奇"
        ? {
          cnName: "柯克-辛里奇"
        }
        : {
          cnName: data
        };
    $.ajax({
      url: "/getSinglePlayerSeasonAvg",
      type: "post",
      dataType: "json",
      data: postData,
      success: data => {
        let seasonAvg = data[0]["seasonAvg"];
        // console.log(seasonAvg)
        let dataAvg = seasonAvg.map((item, index) => {
          if (item.indexOf("%") != -1) {
            return (parseFloat(item) / 100).toFixed(2);
          } else {
            return parseFloat(item);
          }
        });
        // console.log(dataAvg);
        let data2 = [];
        for (let i in dataAvg) {
          if (i == 5 || i == 14 || (i <= 22 && i >= 17)) {
            data2.push(dataAvg[i]);
          }
        }
        let max = [];
        for (let i = 0; i < data1.length; i++) {
          max[i] = data1[i] > data2[i] ? data1[i] : data2[i];
        }
        let indicator = [
          {
            name: "投篮%",
            max: 1
          },
          {
            name: "篮板",
            max: 100
          },
          {
            name: "助攻",
            max: 50
          },
          {
            name: "抢断",
            max: 50
          },
          {
            name: "盖帽",
            max: 50
          },
          {
            name: "失误",
            max: 50
          },
          {
            name: "犯规",
            max: 50
          },
          {
            name: "得分",
            max: 200
          }
        ];
        for (let i = 0; i < indicator.length; i++) {
          indicator[i]["max"] = max[i];
        }
        this.getInitialChart(indicator, data1, data2, id);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  getInitialChart(indicator, data1, data2, id) {
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    myChart.setOption({
      color: ["rgba(0,183,238, 1)", "rgba(86,199,60, 1)"],
      tooltip: {
        show: true,
        trigger: "item"
      },
      radar: {
        center: ["45%", "50%"],
        radius: "70%",
        startAngle: 90,
        splitNumber: 4,
        shape: "circle",
        splitArea: {
          areaStyle: {
            color: ["transparent"]
          }
        },
        axisLabel: {
          show: false,
          fontSize: 20,
          color: "#000",
          fontStyle: "normal",
          fontWeight: "normal"
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#000"
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "#000"
          }
        },
        // indicator的最大值要设定
        indicator: indicator
      },
      series: [
        {
          name: "本场表现数据",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          areaStyle: {
            normal: {
              color: "rgba(86,199,60, 0.4)"
            }
          },
          itemStyle: {
            color: "rgba(86,199,60, 1)",
            borderColor: "rgba(86,199,60, 0.3)",
            borderWidth: 10
          },
          lineStyle: {
            normal: {
              color: "rgba(86,199,60, 1)",
              width: 2
            }
          },
          data: [data1]
        },
        {
          name: "生涯场均数据",
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: "rgba(0,183,238, 1)",
              borderColor: "rgba(0,183,238, 0.4)",
              borderWidth: 10
            }
          },
          areaStyle: {
            normal: {
              color: "rgba(0,183,238, 1)"
            }
          },
          lineStyle: {
            normal: {
              color: "rgba(0,183,238, 1)",
              width: 2
            }
          },
          data: [data2]
        }
      ]
    });
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }
  render() {
    return (
      <div>
        <div id={this.props.id} style={{ width: "288px", height: "248px" }} />
      </div>
    );
  }
}

export default SeasonAvgChart;
