import React from "react";
import { AutoComplete, Button, Icon, Input } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MatchItem from "./match-item";

class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() { }
  componentWillMount() { }
  render() {
    let matchContent = this.props.matchContent;
    let matchUrl = this.props.matchUrl;
    let match = [];
    for (let i = 0; i < matchContent.length; i++) {
      let activeMatch = {};
      for (let j = 0; j < matchUrl.length; j++) {
        if (i == j) {
          activeMatch.content = matchContent[i];
          activeMatch.url = matchUrl[j];
          match.push(activeMatch);
        }
      }
    }
    const matchItems = match.map((item, index) => {
      const url = item.url.split("/")[4];
      return (
        <Router key={index}>
          <Link to={`/match/${url}`}>
            <MatchItem
              key={index}
              content={item.content}
              url={item.url}
              handleMatchDetail={this.props.handleMatchDetail}
            />
          </Link>
        </Router>
      );
    });
    return (
      <div>
        <AutoComplete
          dataSource={matchContent}
          style={{
            width: 150,
            marginTop: 10,
            marginBottom: 20,
            marginLeft: 15
          }}
          onSearch={this.handleSearch}
          placeholder="搜索比赛"
        />
        {matchItems}
      </div>
    );
  }
}

export default MatchList;
