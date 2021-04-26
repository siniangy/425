import React from "react";
import { Tabs, Skeleton, BackTop } from "antd";
import MatchNews from "./matchnews/match-news.js";
import MatchChart from "./matchchart/match-chart.js";

const TabPane = Tabs.TabPane;

class MatchDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      emptyState: false,
      dateParams: '',
      currentUrl: '',
      singleMatchData: [],
      playByplayData: []
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentUrl !== nextProps.currentUrl) {
      if (nextProps.currentUrl) {
        let urlNumber = parseInt(nextProps.currentUrl.split('//')[1].split('/')[2].split('.')[0]);
        if (urlNumber <= 43531 && urlNumber >= 43526 && urlNumber !== 43530) {
          this.setState({
            emptyState: true
          })
        } else {
          this.setState({
            emptyState: false
          })
        }
        this.setState({
          isLoading: true,
          dateParams: nextProps.dateParams,
          currentUrl: nextProps.currentUrl
        }, () => {

        });
        this.getSingleMatchDetail(nextProps.currentUrl);
        this.getSingleMatchPlayByPlay(nextProps.currentUrl);
      }
    }
  }
  getSingleMatchPlayByPlay(data) {
    const postData = {
      url: data
    };
    $.ajax({
      url: "/getSingleMatchPlayByPlaycn",
      type: "post",
      dataType: "json",
      data: postData,
      success: data => {
        this.setState(
          {
            playByplayData: data
          },
          () => { }
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  getSingleMatchDetail(data) {
    const postData = {
      url: data
    };
    $.ajax({
      url: "/getSingleMatchBasicDetail",
      type: "post",
      dataType: "json",
      data: postData,
      success: data => {
        this.setState(
          {
            singleMatchData: data
          },
          () => { }
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }
  handleKey(key) { }
  render() {
    return (
      <div>
        <BackTop />
        <Tabs defaultActiveKey="2" onChange={key => this.handleKey(key)}>
          <TabPane tab="新闻报道" key="1" forceRender={true}>
            {(this.state.isLoading && this.state.emptyState) ? <MatchNews currentUrl={this.state.currentUrl} /> : <Skeleton />}
          </TabPane>
          <TabPane tab="数据统计" key="2" forceRender={true}>
            {this.state.isLoading ? (
              <MatchChart
                singleMatchData={this.state.singleMatchData}
                playByplayData={this.state.playByplayData}
                dateParams={this.state.dateParams}
              />
            ) : (
                <Skeleton />
              )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MatchDetail;
