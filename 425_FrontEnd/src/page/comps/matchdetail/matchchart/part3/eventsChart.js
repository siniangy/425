import React from "react";

class Part3Chart2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointDiff: [],
      diffLength: [],
      eventDetail: [],
      width: this.props.width
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (this.props.pointDiff != nextProps.pointDiff) {
      if (nextProps.pointDiff) {
        this.setState(
          {
            pointDiff: nextProps.pointDiff,
            diffLength: nextProps.diffLength,
            eventDetail: nextProps.eventDetail
          },
          () => {
            this.getInitialChart(
              this.state.pointDiff,
              this.state.diffLength,
              this.state.eventDetail
            );
          }
        );
      }
    }
  }
  getInitialChart(target, length, array) {
    echarts.dispose(document.getElementById("part3Chart2Main"));
    var myChart = echarts.init(document.getElementById("part3Chart2Main"));
    var option = {
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "2%"];
        },
        formatter: function (params, callback) {
          let data = [];
          if (parseInt(params[0]["axisValue"]) >= 0) {
            data = array[parseInt(params[0]["axisValue"])];
            let showScore = "当前比分：";
            showScore += data[3];
            let showContent = "当前事件：";
            if (data[1] != "" && data[5] == "") {
              showContent += data[1];
            } else if (data[1] == "" && data[5] != "") {
              showContent += data[5];
            } else {
              showContent += data[1] + "  " + data[5];
            }
            var res = "<b>" + showScore + "</b>" + "<br />" + showContent;
            return res;
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: length,
        axisLine: {
          lineStyle: {
            color: "#A0A0A0",
            width: "1"
            // shadowColor: "rgba(0, 0, 0, 1)",
            // shadowBlur: 2
          }
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        axisLine: {
          show: false
        },
        // show: false
        show: true
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          start: 0,
          end: 100,
          handleSize: 8
        },
        // {
        //   type: "inside",
        //   start: 0,
        //   end: 30
        // },
        // {
        //   type: "slider",
        //   show: true,
        //   yAxisIndex: 0,
        //   filterMode: "empty",
        //   width: 12,
        //   height: "70%",
        //   handleSize: 8,
        //   showDataShadow: false,
        //   left: "93%"
        // }
      ],
      series: [
        {
          name: "Den",
          type: "bar",
          itemStyle: {
            normal: {
              color: function (params) {
                let data = array[parseInt(params["dataIndex"])];
                if (data[1] != "") {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "rgba(93,227,225,0.5)" },
                    { offset: 0.2, color: "rgba(93,227,225,0.8)" },
                    { offset: 1, color: "rgba(93,227,225,1)" }
                  ]);
                } else {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "rgba(138,62,135,0.5)" },
                    { offset: 0.2, color: "rgba(138,62,135,0.8)" },
                    { offset: 1, color: "rgba(138,62,135,1)" }
                  ]);
                }
              }
            }
          },
          data: target
        }, {
          name: "1",
          type: "line",
          data: target,
          symbol: "none",
          lineStyle: {
            color: '#c2565a'
          },
          smooth: true
        }
      ]
    };
    myChart.setOption(option);
  }
  render() {
    const width = this.props.width * 2;
    return (
      <div>
        <div id="part3Chart2Main" style={{ width: 1000, height: 300, margin: "0px auto" }} />
      </div>
    );
  }
}

export default Part3Chart2;
