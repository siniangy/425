import React from "react";
import { Table } from "antd";

class Part1Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team1Name: "",
      team2Name: "",
      team1Score: [],
      team2Score: [],
      team1Sum: 0,
      team2Sum: 0
    };
  }
  componentDidMount() { }
  componentWillMount() { }

  componentWillReceiveProps(nextProps) {
    if (this.props.team1Name != nextProps.team1Name) {
      if (nextProps.team1Name) {
        this.setState(
          {
            team1Name: nextProps.team1Name,
            team2Name: nextProps.team2Name,
            team1Score: nextProps.team1Score,
            team2Score: nextProps.team2Score,
            team1Sum: nextProps.team1Sum,
            team2Sum: nextProps.team2Sum
          },
          () => {
            // console.log(this.state.team1Score)
          }
        );
      }
    }
  }
  render() {
    const {
      team1Name,
      team2Name,
      team1Score,
      team2Score,
      team1Sum,
      team2Sum
    } = this.props;
    const dataSource = [
      {
        key: "0",
        球队: team1Name,
        "1": team1Score[0],
        "2": team1Score[1],
        "3": team1Score[2],
        "4": team1Score[3],
        "5": team1Sum
      },
      {
        key: "1",
        球队: team2Name,
        "1": team2Score[0],
        "2": team2Score[1],
        "3": team2Score[2],
        "4": team2Score[3],
        "5": team2Sum
      }
    ]
    const columns = [
      {
        title: "球队",
        dataIndex: "球队",
        key: "0",
        render: a => <b>{a}</b>
      },
      {
        title: "1",
        dataIndex: "1",
        key: "1"
      },
      {
        title: "2",
        dataIndex: "2",
        key: "2"
      },
      {
        title: "3",
        dataIndex: "3",
        key: "3"
      },
      {
        title: "4",
        dataIndex: "4",
        key: "4"
      },
      {
        title: "总分",
        dataIndex: "5",
        key: "5"
      }
    ] 
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
        />
      </div>
    );
  }
}

export default Part1Table;
