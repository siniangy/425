import React from "react";

class MatchItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() { }
  componentWillMount() { }
  render() {
    return (
      <div>
        <div
          style={{
            marginBottom: 30,
            color: "#333",
            border: "20px solid #87cefa",
            borderRadius: "20px",
            textAlign: "center",
            cursor: "pointer"
          }}
          onClick={this.props.handleMatchDetail}
        >
          <span style={{ display: "none" }}>{this.props.url}</span>
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default MatchItem;
