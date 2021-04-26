import React from "react";

class Part3Chart1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      relation: [],
      width: this.props.width
    };
  }
  componentDidMount() {
    // window.addEventListener('resize', () => {
    //   this.myChart3.resize()
    // })
  }
  componentWillMount() { }
  componentWillUnmount() {
    // window.removeEventListener('resize', () => {
    //   this.myChart3.resize()
    // })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.players != nextProps.players) {
      if (nextProps.players) {
        this.setState(
          {
            players: nextProps.players,
            relation: nextProps.relation
          },
          () => {
            this.getInitialChart(this.state.players, this.state.relation);
          }
        );
      }
    }
  }
  getInitialChart(dataName, dataLink) {
    var myChart = echarts.init(document.getElementById("part3Chart1Main"));
    var data = {
      dataName: dataName,
      dataLink: dataLink,
      color: [
        "#4CB7F2",
        "#458FF0",
        "#F5B751",
        "#70C6A2",
        "#70649A",
        "#4F726C",
        "#E58980",
        "#BC9F77",
        "#EDC7C7",
        "#B55D4C",
        "#69A8A0",
        "#4CB7F2",
        "#458FF0",
        "#F5B751",
        "#70C6A2"
      ]
    };
    var { title, dataName, dataLink, color } = data;
    var le = data.size || dataName.length;
    // 布局直接用现成的，反正都差不多（8-15个球员）
    if (le == 5) {
      // dataName = [
      //     'c1', 'c2', 'c3', 'c4', 'css',
      // ];
      var symbolSize = 54;
      var xIndex = ["100", "80", "120", "85", "115"];
      var yIndex = ["80", "95", "95", "115", "115"];
    } else if (le == 6) {
      var symbolSize = 55;
      var xIndex = ["100", "70", "130", "70", "130", "100"];
      var yIndex = ["80", "95", "95", "120", "120", "135"];
    } else if (le == 7) {
      var symbolSize = 50;
      var xIndex = ["100", "60", "140", "50", "150", "75", "125"];
      var yIndex = ["55", "75", "75", "110", "110", "145", "145"];
    } else if (le == 8) {
      var symbolSize = 50;
      var xIndex = ["100", "60", "140", "40", "160", "60", "140", "100"];
      var yIndex = ["35", "60", "60", "100", "100", "135", "135", "155"];
    } else if (le == 9) {
      var symbolSize = 44;
      var xIndex = ["100", "40", "160", "15", "185", "40", "100", "160", "100"];
      var yIndex = ["18", "45", "45", "100", "100", "150", "100", "150", "180"];
    } else if (le == 10) {
      var symbolSize = 44;
      var xIndex = [
        "100",
        "40",
        "160",
        "15",
        "185",
        "40",
        "100",
        "165",
        "75",
        "125"
      ];
      var yIndex = [
        "18",
        "45",
        "45",
        "100",
        "100",
        "150",
        "100",
        "145",
        "180",
        "180"
      ];
    } else if (le == 11) {
      var symbolSize = 43;
      var xIndex = [
        "100",
        "40",
        "160",
        "15",
        "185",
        "40",
        "70",
        "130",
        "165",
        "75",
        "125"
      ];
      var xIndex = [
        "110",
        "50",
        "170",
        "25",
        "195",
        "50",
        "80",
        "140",
        "175",
        "85",
        "135"
      ];
      var yIndex = [
        "20",
        "45",
        "45",
        "100",
        "100",
        "150",
        "100",
        "100",
        "150",
        "180",
        "180"
      ];
    } else if (le == 12) {
      var symbolSize = 42;
      var xIndex = [
        "110",
        "50",
        "170",
        "25",
        "195",
        "80",
        "140",
        "50",
        "80",
        "140",
        "175",
        "110"
      ];
      var yIndex = [
        "15",
        "45",
        "45",
        "100",
        "100",
        "80",
        "80",
        "150",
        "120",
        "120",
        "150",
        "180"
      ];
    } else if (le == 13) {
      var symbolSize = 40;
      var xIndex = [
        "100",
        "40",
        "160",
        "15",
        "185",
        "70",
        "130",
        "40",
        "70",
        "130",
        "165",
        "75",
        "125"
      ];
      var yIndex = [
        "15",
        "45",
        "45",
        "100",
        "100",
        "80",
        "80",
        "150",
        "120",
        "120",
        "145",
        "180",
        "180"
      ];
    } else if (le == 14) {
      var symbolSize = 39;
      var xIndex = [
        "100",
        "40",
        "160",
        "15",
        "100",
        "185",
        "65",
        "135",
        "40",
        "75",
        "125",
        "165",
        "75",
        "125"
      ];
      var yIndex = [
        "15",
        "45",
        "45",
        "100",
        "60",
        "100",
        "85",
        "85",
        "150",
        "130",
        "130",
        "145",
        "180",
        "180"
      ];
    }

    function getDate() {
      let _data = [];
      for (var i = 0, le = dataName.length; i < le; i++) {
        _data.push({
          name: dataName[i],
          x: xIndex[i],
          y: yIndex[i],
          itemStyle: {
            normal: {
              color: color[i]
            }
          },
          label: {
            normal: {
              x: "center",
              y: "center",
              show: true,
              textStyle: {
                fontSize: "12",
                fontWeight: "600",
                lineHeight: "40",
                color: "#000"
              }
            }
          }
        });
      }
      return _data;
    }

    function getLinks() {
      let _data = [];
      for (var i = 0, le = dataLink.length; i < le; i++) {
        _data.push({
          source: dataLink[i][0],
          target: dataLink[i][1],
          value: dataLink[i][2],
          lineStyle: {
            normal: {
              opacity: 0.9,
              width: dataLink[i][2] * 2,
              curveness: 0.3,
              color: color[dataLink[i][3] - 1]
            }
          }
        });
      }
      return _data;
    }
    var option = {
      title: {
        text: title,
        x: "center",
        y: "2%",
        textStyle: {
          color: "#333",
          fontSize: "16",
          fontWeight: "normal",
          top: "0"
        }
      },
      toolbox: {
        right: "10%",
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          type: "graph",
          layout: "none",
          focusNodeAdjacency: true,
          symbolSize: symbolSize,
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                // fontSize: 20
              },
              formatter: function (params) {
                let txt = "助攻";
                if (parseInt(params.data.value) > 1) {
                  return txt + params.data.value;
                } else {
                  return "";
                }
              }
            }
          },
          data: getDate(),
          links: getLinks()
        }
      ]
    };
    myChart.setOption(option);
    myChart.on("click", function (params) { });
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }
  render() {
    const width = this.props.width;
    return (
      <div>
        <div
          id="part3Chart1Main"
          style={{
            width: width,
            height: 500
          }}
        />
      </div>
    );
  }
}

export default Part3Chart1;
