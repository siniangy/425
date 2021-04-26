import React from "react";
import { Table, Popover, Card, message, Icon } from "antd";
import Chart from "./seasonAvg.js";

class Part2Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamDetail: [],
      modalTarget: "",
      showData: "",
      cardData: [],
      jsonLength: 0 // 判断渲染是advans还是basic
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (this.props.teamDetail != nextProps.teamDetail) {
      if (nextProps.teamDetail) {
        this.setState(
          {
            teamDetail: nextProps.teamDetail,
            cardData: [],
            jsonLength: Object.keys(nextProps.teamDetail[0]).length
          },
          () => {
            // console.log(this.state.jsonLength);
            // console.log(this.state.teamDetail);
          }
        );
      }
    }
  }
  getKnowledgeMapData(url) {
    $.ajax({
      url: url,
      type: "get",
      dataType: "json",
      success: data => {
        this.setState(
          {
            showData: data["data"]["desc"]
          },
          () => { }
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  handleMessageInfo1() {
    message.info("请不要重复输入");
  }
  handleMessageInfo12() {
    message.info("展示卡片不要超过5个");
  }
  handleClick(e) {
    const data = this.state.cardData;
    if (data.indexOf(e.text) === -1 && data.length <= 4) {
      data.push(e.text);
    } else {
      if (data.indexOf(e.text != -1) && data.length <= 4) {
        this.handleMessageInfo1();
      } else {
        this.handleMessageInfo12();
      }
    }
    this.setState({
      cardData: data
    });
  }
  handleDelete(e, i) {
    let data = this.state.cardData;
    data = data.filter(item => item !== e.item);
    this.setState(
      {
        cardData: data
      },
      () => {
        // console.log(this.state.cardData);
      }
    );
  }
  handleModal(e) {
    let a = "";
    if (e.target.innerHTML.indexOf("-") != -1) {
      a = e.target.innerHTML.split("-").join("·");
    } else {
      a = e.target.innerHTML;
    }
    this.getKnowledgeMapData(
      "https://api.ownthink.com/kg/knowledge?entity=" + a.toString()
    );
    this.setState(
      {
        modalTarget: e.target.innerHTML
      },
      () => { }
    );
  }
  render() {
    const { teamDetail, modalTarget, showData, cardData } = this.state;
    const cardItems = cardData.map((item, index) => {
      const data = this.state.teamDetail.filter((t, i) => t["0"] == item);
      return (
        <div
          key={index}
          style={{
            display: "inline-block",
            marginLeft: "20px",
            marginBottom: "10px",
            border: "2px solid rgba(240,242,245,1)"
          }}
          id={index + "chart"}
        >
          <Card
            title={item}
            key={index}
            extra={
              <Icon
                type="close"
                style={{ cursor: "pointer" }}
                onClick={() => this.handleDelete({ item }, { index })}
              />
            }
            style={{ width: "300px", display: "inline-block", padding: "5px" }}
          >
            <Chart target={item} targetDetail={data} id={index} />
          </Card>
        </div>
      );
    });
    const content = (
      <div>
        <p style={{ textIndent: "2em" }}>{this.state.showData}</p>
      </div>
    );
    const dataSource = teamDetail;
    const basicColumns = [
      {
        title: "球员",
        dataIndex: "0",
        key: "0",
        width: 180,
        fixed: "left",
        render: (text, record) => (
          <div>
            <Popover
              content={content}
              title={modalTarget}
              placement="right"
              trigger="click"
              overlayStyle={{ width: "500px" }}
              onClick={e => this.handleModal(e)}
            >
              <b
                style={{
                  fontSize: "14px",
                  color: "rgba(24,144,255,1)",
                  cursor: "pointer"
                }}
              >
                {text}
              </b>
            </Popover>
            <Icon
              type="radar-chart"
              style={{
                marginLeft: "3px",
                color: "rgb(24,144,255)",
                cursor: "pointer"
              }}
              onClick={() => this.handleClick({ text })}
            />
          </div>
        )
      },
      {
        title: "首发",
        dataIndex: "1",
        key: "1",
        width: 56
      },
      {
        title: "时间",
        dataIndex: "2",
        key: "2",
        width: 67
      },
      {
        title: "投篮%",
        dataIndex: "3",
        key: "3",
        width: 82,
        render: a => (
          // <p style={{ marginTop: "13.5px" }}>
          //   {" "}
          //   {parseInt(a.toFixed(2).slice(2, 4)) + "%"}{" "}
          // </p>
          parseInt(a.toFixed(2).slice(2, 4)) + "%"
        )
      },
      {
        title: "命中",
        dataIndex: "4",
        key: "4",
        width: 56
      },
      {
        title: "出手",
        dataIndex: "5",
        key: "5",
        width: 67
      },
      {
        title: "三分%",
        dataIndex: "6",
        key: "6",
        width: 82,
        render: a => (
          // <p style={{ marginTop: "13.5px" }}>
          //   {" "}
          //   {parseInt(a.toFixed(2).slice(2, 4)) + "%"}{" "}
          // </p>
          parseInt(a.toFixed(2).slice(2, 4)) + "%"
        )
      },
      {
        title: "命中",
        dataIndex: "7",
        key: "7",
        width: 56
      },
      {
        title: "出手",
        dataIndex: "8",
        key: "8",
        width: 56
      },
      {
        title: "罚球%",
        dataIndex: "9",
        key: "9",
        width: 94,
        render: a => (
          // <p style={{ marginTop: "13.5px" }}> {parseFloat(a) * 100 + "%"}</p>
          // parseFloat(a) * 100 + "%"
          parseInt(a.toFixed(2).slice(2, 4)) + "%"
        )
      },
      {
        title: "命中",
        dataIndex: "10",
        key: "10",
        width: 56
      },
      {
        title: "出手",
        dataIndex: "11",
        key: "11",
        width: 56
      },
      {
        title: "真实命中%",
        dataIndex: "12",
        key: "12",
        width: 82,
        render: a => (
          // <p style={{ marginTop: "13.5px" }}>
          //   {" "}
          //   {parseInt(a.toFixed(2).slice(2, 4)) + "%"}{" "}
          // </p>
          parseInt(a.toFixed(2).slice(2, 4)) + "%"
        )
      },
      {
        title: "篮板",
        dataIndex: "13",
        key: "13",
        width: 67
      },
      {
        title: "前场",
        dataIndex: "14",
        key: "14",
        width: 56
      },
      {
        title: "后场",
        dataIndex: "15",
        key: "15",
        width: 67
      },
      {
        title: "助攻",
        dataIndex: "16",
        key: "16",
        width: 56
      },
      {
        title: "抢断",
        dataIndex: "17",
        key: "17",
        width: 56
      },
      {
        title: "盖帽",
        dataIndex: "18",
        key: "18",
        width: 56
      },
      {
        title: "失误",
        dataIndex: "19",
        key: "19",
        width: 56
      },
      {
        title: "犯规",
        dataIndex: "20",
        key: "20",
        width: 57
      },
      {
        title: "得分",
        dataIndex: "21",
        key: "21",
        width: 69
      }
    ];
    const advansColumns = [
      {
        title: "球员",
        dataIndex: "0",
        key: "0",
        width: 180,
        fixed: 'left',
        render: (text, record) => (
          <div>
            <b
              style={{
                fontSize: "14px",
                // color: "rgba(24,144,255,1)",
              }}
            >
              {text}
            </b>
          </div>
        )
      },
      {
        title: "MP",
        dataIndex: "1",
        key: "1",
        width: 81
      },
      {
        title: "TS%",
        dataIndex: "2",
        key: "2",
        width: 71
      },
      {
        title: "eFG%",
        dataIndex: "3",
        key: "3",
        width: 71
      },
      {
        title: "3PAr",
        dataIndex: "4",
        key: "4",
        width: 71
      },
      {
        title: "FTr",
        dataIndex: "5",
        key: "5",
        width: 71
      },
      {
        title: "ORB%",
        dataIndex: "6",
        key: "6",
        width: 71
      },
      {
        title: "DRB%",
        dataIndex: "7",
        key: "7",
        width: 71
      },
      {
        title: "TRB%",
        dataIndex: "8",
        key: "8",
        width: 71
      },
      {
        title: "AST%",
        dataIndex: "9",
        key: "9",
        width: 71
      },
      {
        title: "STL%",
        dataIndex: "10",
        key: "10",
        width: 63
      },
      {
        title: "BLK%",
        dataIndex: "11",
        key: "11",
        width: 63
      },
      {
        title: "TOV%",
        dataIndex: "12",
        key: "12",
        width: 71
      },
      {
        title: "USG%",
        dataIndex: "13",
        key: "13",
        width: 72
      },
      {
        title: "ORtg",
        dataIndex: "14",
        key: "14",
        width: 68
      },
      {
        title: "DRtg",
        dataIndex: "15",
        key: "15",
        width: 69
      }
    ];
    return (
      <div>
        {cardItems}
        {this.state.jsonLength > 18 ? (
          <Table
            dataSource={dataSource}
            columns={basicColumns}
            pagination={false}
            scroll={{ x: 1500, y: 500 }}
          />
        ) : (
            <Table
              dataSource={dataSource}
              columns={advansColumns}
              pagination={false}
              scroll={{ x: 1300, y: 500 }}
            />
          )}
      </div>
    );
  }
}

export default Part2Table;
