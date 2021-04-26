import React from "react";

export default class knowledgeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      target: this.props.target,
      mapData: [],
      mapLink: [],
      mapCategories: []
    };
  }
  componentWillMount() {
    this.getKnowledgeMapData(
      "https://api.ownthink.com/kg/knowledge?entity=" +
      this.props.target.toString()
    );
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) {
    if (this.props.target !== nextProps.target) {
      if (nextProps.target) {
        this.setState(
          {
            target: nextProps.target
          },
          () => {
            this.getKnowledgeMapData(
              "https://api.ownthink.com/kg/knowledge?entity=" +
              this.state.target.toString()
            );
          }
        );
      }
    }
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
        symbolSize: 50,
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

  getKnowledgeMapData(url) {
    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      success: res => {
        let data = res.data.avp;
        if (data) {
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === '台湾地区译名') {
              data[i][1] = data[i][1] + '.'
            } else if (data[i][0] === '加入NBA时间') {
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
              this.getInitialChart(
                this.state.mapData,
                this.state.mapLink,
                this.state.mapCategories
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
  getInitialChart(data, link, categories) {
    const { handleMapTarget } = this.props;
    var myChart = echarts.init(document.getElementById("mapMain"));
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
              color: "target",
              curveness: 0,
              type: "solid"
            }
          }
        }
      ]
    };
    myChart.setOption(option);
    myChart.on("click", function (params) {
      handleMapTarget(params.data.name);
    });
  }
  render() {
    return <div id="mapMain" style={{ width: "500px", height: "400px" }} />;
  }
}
