import React from "react";

export default class NewsMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: this.props.target,
      data: this.props.data,
      showData: [], // 处理球员，本地json的数据
      showFilterData: [],
      mapData: [], // 处理球队，直接用开源的吧
      mapLink: [],
      mapCategories: []
    };
  }
  componentWillMount() {
    this.handleShowData(
      this.props.data,
      this.props.target
    );
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) {
    if (this.props.data[this.props.target] !== nextProps.data[nextProps.target]) {
      if (nextProps.target) {
        this.handleShowData(
          nextProps.data,
          nextProps.target
        );
      }
    }
  }
  handleShowData(data, target) {
    let team = {
      '篮网': '布鲁克林篮网',
      '魔术': '奥兰多魔术',
      '凯尔特人': '波士顿凯尔特',
      '马刺': '圣安东尼奥马刺',
      '骑士': '克里夫兰骑士',
      '黄蜂': '夏洛特黄蜂',
      '活塞': '底特律活塞',
      '快船': '洛杉矶快船',
      '勇士': '金州勇士',
      '太阳': '菲尼克斯太阳',
      '火箭': '休斯顿火箭',
      '步行者': '印第安纳步行者',
      '爵士': '犹他爵士',
      '湖人': '洛杉矶湖人',
      '独行侠': '达拉斯独行侠',
      '灰熊': '孟菲斯灰熊',
      '老鹰': '亚特兰大老鹰',
      '雄鹿': '密尔沃基雄鹿',
      '雷霆': '俄克拉荷马雷霆',
      '森林狼': '明尼苏达森林狼',
      '奇才': '华盛顿奇才',
      '尼克斯': '纽约尼克斯',
      '掘金': '丹佛掘金',
      '开拓者': '波特兰开拓者',
      '鹈鹕': '新奥尔良鹈鹕',
      '国王': '萨克拉门托国王',
      '热火': '迈阿密热火',
      '猛龙': '多伦多猛龙',
      '76人': '费城76人',
      '公牛': '芝加哥公牛'
    }
    if (target === '上一次交手') {
      let data1 = this.handleTeamInfoData(data[target]["data"][0]["row"]);
      let data2 = this.handleTeamScoreData(data[target]["data"][0]["row"]);
      this.setState(
        {
          showData: data1,
          showFilterData: data2
        },
        () => {
          this.getInitialChart2(
            target,
            this.state.showData,
            this.state.showFilterData
          );
        }
      );
    } else if (team[target]) {
      this.getKnowledgeMapData(
        "https://api.ownthink.com/kg/knowledge?entity=" +
        team[target].toString() + '队', target
      );
    } else {
      let data1 = this.handleMapData(data[target]["data"][0]["row"]);
      let data2 = data1.filter((item, index) => { return item[0] != "主页" });
      this.setState(
        {
          showData: data1,
          showFilterData: data2
        },
        () => {
          this.getInitialChart(
            this.changeData(this.state.showFilterData),
            this.changeLink(this.state.showFilterData),
            this.changeCategories(this.state.showFilterData),
            target,
            this.state.showData
          );
        }
      );
    }
  }
  handleMapData(data) {
    let A = [];
    let B = [];
    for (let key in data[0]) {
      let a = [];
      let b = [];
      if (key == "姓名") {
        a.push(key, data[0][key]);
        A.push(a);
      } else {
        b.push(key, data[0][key]);
        B.push(b);
      }
    }
    return A.concat(B);
  }
  handleTeamInfoData(data) {
    let A = [];
    if (data[0]['id']) {
      A.push(data[0]['时间']);
      A.push(data[0]['比分']);
    } else {
      A.push(data[1]['时间']);
      A.push(data[1]['比分']);
    }
    return A;
  }
  handleTeamScoreData(data) {
    // console.log(parseInt(data[0]['主队第一节']))
    let target = [];
    let A = [];
    let B = [];
    if (data[0]['id']) {
      A.push(parseInt(data[0]['主队第一节']));
      A.push(parseInt(data[0]['主队第二节']));
      A.push(parseInt(data[0]['主队第三节']));
      A.push(parseInt(data[0]['主队第四节']));
      B.push(parseInt(data[0]['客队第一节']));
      B.push(parseInt(data[0]['客队第二节']));
      B.push(parseInt(data[0]['客队第三节']));
      B.push(parseInt(data[0]['客队第四节']));
      target.push(A, B);
    } else {
      A.push(parseInt(data[1]['主队第一节']));
      A.push(parseInt(data[1]['主队第二节']));
      A.push(parseInt(data[1]['主队第三节']));
      A.push(parseInt(data[1]['主队第四节']));
      B.push(parseInt(data[1]['客队第一节']));
      B.push(parseInt(data[1]['客队第二节']));
      B.push(parseInt(data[1]['客队第三节']));
      B.push(parseInt(data[1]['客队第四节']));
      target.push(A, B);
    }
    return target;
  }
  getKnowledgeMapData(url, id) {
    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      success: res => {
        let data = res.data.avp;
        if (data) {
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] == '台湾地区译名') {
              data[i][1] = data[i][1] + '.'
            }
          }
          this.setState(
            {
              mapCategories: this.changeCategories(data),
              mapLink: this.changeLink(data),
              mapData: this.changeData(data)
            },
            () => {
              this.getInitialChart3(
                this.state.mapData,
                this.state.mapLink,
                this.state.mapCategories,
                id
              );
            }
          );
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }
  changeData(array) {
    let data = [];
    let color = [
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
      "#70C6A2",
      "#B28ECC",
      "#68A79F",
      "#E58980",
      "#BC9F77",
      "#EDC7C7"
    ];
    let y = [100, 150, 200, 250];
    for (let i in array) {
      let d = {
        symbolSize: 60,
        draggable: "true",
        itemStyle: {
          normal: {
            color: color[i]
          }
        }
      };
      d.name = array[i][1];
      d.category = array[i][i];
      d.x = i * 10;
      d.y = y[Math.ceil(Math.random() * 3)];
      data.push(d);
    }
    return data;
  }
  changeLink(array) {
    let link = [];
    for (let i = 1; i < array.length; i++) {
      let d = {
        source: array[0][1]
      };
      d.target = array[i][1];
      d.value = array[i][0];
      link.push(d);
    }
    return link;
  }
  changeCategories(array) {
    let categories = [];
    for (let i in array) {
      let d = {};
      d.name = array[i][1];
      categories.push(d);
    }
    return categories;
  }

  getInitialChart(data, link, categories, id, showData) {
    var chart = document.getElementById(id);
    echarts.dispose(chart);
    var myChart = echarts.init(chart);
    var option = {
      title: {},
      tooltip: {
        formatter: "{b}"
      },
      series: [
        {
          name: "球员知识图谱（测试）",
          type: "graph",
          layout: "force",
          focusNodeAdjacency: true,
          force: {
            repulsion: 60,
            gravity: 0.1,
            edgeLength: 30,
            layoutAnimation: true
          },
          data: data,
          links: link,
          categories: categories,
          roam: false,
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 10
              },
              formatter: function (params) {
                return params.data.value
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{b}",
              fontSize: 12,
              fontStyle: "600"
            }
          },
          lineStyle: {
            normal: {
              width: 2,
              curveness: 0,
              type: "solid"
            }
          }
        }
      ]
    };
    myChart.setOption(option);
    myChart.on("click", function (params) {
      let url = showData.filter((item, index) => { return item[0] === "主页" });
      if (params.data.category == "姓名") {
        window.open(url[0][1]);
      }
    });
  }

  getInitialChart2(id, info, score) {
    var chart = document.getElementById(id);
    echarts.dispose(chart);
    var myChart = echarts.init(chart);
    myChart.setOption({
      title: {
        text: '比分对比: ' + info[1],
        subtext: '比赛时间: ' + info[0],
        left: 'center',
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ['主队', '客队'],
        show: false
      },
      toolbox: {
        show: true,
        right: "35px",
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          data: ['第一节', '第二节', '第三节', '第四节']
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: '主队',
          type: "bar",
          itemStyle: {
            normal: {
              color: 'rgba(93, 227, 225, 1)'
            }
          },
          data: score[0],
          markLine: {
            data: [
              {
                type: "average",
                name: "平均值"
              }
            ]
          }
        },
        {
          name: '客队',
          type: "bar",
          itemStyle: {
            normal: {
              color: 'rgba(138, 62, 235, 1)'
            }
          },
          data: score[1],
          markLine: {
            data: [
              {
                type: "average",
                name: "平均值"
              }
            ]
          }
        }
      ]
    });
  }
  getInitialChart3(data, link, categories, id) {
    var chart = document.getElementById(id);
    echarts.dispose(chart);
    var myChart = echarts.init(chart);
    var option = {
      title: {},
      tooltip: {
        formatter: "{b}"
      },
      series: [
        {
          name: "球队知识图谱",
          type: "graph",
          layout: "force",
          force: {
            repulsion: 60,
            gravity: 0.1,
            edgeLength: 30,
            layoutAnimation: true
          },
          data: data,
          links: link,
          categories: categories,
          roam: false,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{b}",
              fontSize: 12,
              fontStyle: "600"
            }
          },
          lineStyle: {
            normal: {
              width: 2,
              curveness: 0,
              type: "solid"
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }
  render() {
    return (
      <div>
        <div
          id={this.props.target}
          style={{ width: "460px", height: "400px" }}
        />
      </div>
    );
  }
}
