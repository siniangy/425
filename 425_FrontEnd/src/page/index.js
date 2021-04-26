import React from "react";
import { Select, Button, Layout, Menu } from "antd";
import { BrowserRouter as Router, Link } from "react-router-dom";
import MatchList from "./comps/matchlist/match-list.js";
import MatchDetail from "./comps/matchdetail/match-detail.js";
import "./style/index.less";

const Option = Select.Option;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class NewsVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "2019",
      month: "03",
      day: "01",
      dateParams: "",
      matchContent: [],
      matchUrl: [],
      currentMatch: "",
      currentUrl: ""
    };
  }
  componentDidMount() { }
  componentWillMount() { }
  getMatchItems(data) {
    const postData = {
      date: data
    };
    $.ajax({
      url: "/getMatchItems",
      type: "post",
      dataType: "json",
      data: postData,
      success: data => {
        this.setState({
          matchContent: data[0]["content"],
          matchUrl: data[0]["url"]
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }
  handleYearChange(value) {
    this.setState(
      {
        year: value
      },
      () => { }
    );
  }
  handleMonthChange(value) {
    this.setState(
      {
        month: value
      },
      () => { }
    );
  }
  handleDayChange(value) {
    this.setState(
      {
        day: value
      },
      () => { }
    );
  }
  handleClick() {
    this.setState(
      {
        dateParams:
          this.state.year.toString() +
          "-" +
          this.state.month.toString() +
          "-" +
          this.state.day.toString(),
        mainContentShow: true
      },
      () => {
        this.getMatchItems(this.state.dateParams);
      }
    );
  }
  handleMatchDetail(e) {
    this.setState(
      {
        currentUrl: e.target.innerHTML.split("</span>")[0].split('">')[1],
        currentMatch: e.target.innerHTML.split("</span>")[1]
      },
      () => {

      }
    );
  }

  render() {
    const { year, month, day } = this.state;
    return (
      <div>
        <Layout>
          <Header className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              style={{
                lineHeight: "64px"
              }}
            >
              <Menu.Item
                style={{
                  backgroundColor: "rgba(0,21,41,1)"
                }}
              >
                <Router>
                  <Link to="/">
                    <img
                      src="/images/logocp.png"
                      style={{
                        marginLeft: "-40px",
                        marginRight: "50px"
                      }}
                    />
                  </Link>
                </Router>
              </Menu.Item>
              <Menu.Item
                style={{
                  backgroundColor: "rgba(0,21,41,1)"
                }}
              >
                <span>请选择日期：</span>
                <Select
                  defaultValue={this.state.year}
                  style={{
                    maxWidth: 240,
                    minWidth: "120px"
                  }}
                  onChange={value => this.handleYearChange(value)}
                >
                  <Option value="2018">2018</Option>
                  <Option value="2019">2019</Option>
                </Select>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Select
                  defaultValue={this.state.month}
                  style={{
                    maxWidth: 240,
                    minWidth: "120px"
                  }}
                  onChange={value => this.handleMonthChange(value)}
                >
                  <Option value="01">1</Option>
                  <Option value="02">2</Option>
                  <Option value="03">3</Option>
                  <Option value="04">4</Option>
                  <Option value="05">5</Option>
                  <Option value="06">6</Option>
                  <Option value="07">7</Option>
                  <Option value="08">8</Option>
                  <Option value="09">9</Option>
                  <Option value="10">10</Option>
                  <Option value="11">11</Option>
                  <Option value="12">12</Option>
                </Select>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Select
                  defaultValue={this.state.day}
                  style={{
                    maxWidth: 240,
                    minWidth: "120px"
                  }}
                  onChange={value => this.handleDayChange(value)}
                >
                  <Option value="01">1</Option>
                  <Option value="02">2</Option>
                  <Option value="03">3</Option>
                  <Option value="04">4</Option>
                  <Option value="05">5</Option>
                  <Option value="06">6</Option>
                  <Option value="07">7</Option>
                  <Option value="08">8</Option>
                  <Option value="09">9</Option>
                  <Option value="10">10</Option>
                  <Option value="11">11</Option>
                  <Option value="12">12</Option>
                  <Option value="13">13</Option>
                  <Option value="14">14</Option>
                  <Option value="15">15</Option>
                  <Option value="16">16</Option>
                  <Option value="17">17</Option>
                  <Option value="18">18</Option>
                  <Option value="19">19</Option>
                  <Option value="20">20</Option>
                  <Option value="21">21</Option>
                  <Option value="22">22</Option>
                  <Option value="23">23</Option>
                  <Option value="24">24</Option>
                  <Option value="25">25</Option>
                  <Option value="26">26</Option>
                  <Option value="27">27</Option>
                  <Option value="28">28</Option>
                  <Option value="29">29</Option>
                  <Option value="30">30</Option>
                  <Option value="31">31</Option>
                </Select>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </Menu.Item>
              <Menu.Item
                style={{
                  backgroundColor: "rgba(0,21,41,1)"
                }}
              >
                <Router>
                  <Link to="/match">
                    <Button
                      type="primary"
                      shape="circle"
                      icon="search"
                      onClick={() => this.handleClick()}
                    />
                  </Link>
                </Router>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout>
            <Sider
              width={200}
              style={{
                marginTop: "10px"
              }}
            >
              <Menu
                mode="inline"
                style={{
                  height: "100%",
                  borderRight: 0,
                  padding: "10px 10px 10px 5px"
                }}
              >
                <MatchList
                  matchContent={this.state.matchContent}
                  matchUrl={this.state.matchUrl}
                  handleMatchDetail={this.handleMatchDetail.bind(this)}
                />
              </Menu>
            </Sider>
            <Layout
              style={{
                padding: "0 24px 24px",
                marginTop: 10
              }}
            >
              <Content
                style={{
                  background: "#fff",
                  padding: 24,
                  minHeight: 1500
                }}
              >
                <MatchDetail
                  currentUrl={this.state.currentUrl}
                  currentMatch={this.state.currentMatch}
                  dateParams={this.state.dateParams}
                />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default NewsVisualization;
