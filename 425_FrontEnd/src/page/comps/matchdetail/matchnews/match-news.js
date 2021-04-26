import React from "react";
import { Modal } from "antd";
import Info from "./newsInfo.js";
import Iframe from "./newsIframe.js";
import "./news.css";

class MatchNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTarget: "",
      currentUrl: this.props.currentUrl,
      showNewsData: "",
      showInfoData: "",
      visible: false
    };
  }
  componentDidMount() { }
  componentWillMount() { this.getCurrentUrl(this.props.currentUrl) }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentUrl !== nextProps.currentUrl) {
      if (nextProps.currentUrl) {
        this.getCurrentUrl(nextProps.currentUrl)
      }
    }
  }
  getCurrentUrl(url) {
    this.setState({
      currentUrl: url.split('//')[1].split('/')[2].split('.')[0]
    }, () => {
      // console.log(this.state.currentUrl)
      this.getUrlTestNews(this.state.currentUrl)
    })
  }
  getUrlTestNews(id) {
    fetch("/newsdata/news.json")
      .then(response => response.json())
      .then(res => {
        let data = res.data[id]
        this.setState(
          {
            showNewsData: data['news'],
            showInfoData: data
          },
          () => {
            // console.log(this.state.showInfoData)
          }
        );
      })
      .catch(err => console.log(err))
  }
  handleTagName(e) {
    if (e.target.nodeName === 'A') {
      this.setState({
        visible: true,
        modalTarget: e.target.innerHTML
      })
    }
  }
  handleOk(e) {
    this.setState({
      visible: false,
    });
  }

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }
  render() {
    const content = <Info target={this.state.modalTarget} data={this.state.showInfoData} />;
    return (
      <div>
        <div>
          <Iframe currentUrl={this.state.currentUrl} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: this.state.showNewsData }} style={{ fontSize: "18px", textIndent: "2em" }} onClick={(e) => { this.handleTagName(e) }}></div>
        <Modal
          title={this.state.modalTarget}
          visible={this.state.visible}
          onOk={(e) => { this.handleOk(e) }}
          onCancel={(e) => { this.handleCancel(e) }}
          footer={null}
          bodyStyle={{ background: "rgba(255,255,180,0.1)" }}
        >
          {content}
        </Modal>
      </div>
    );
  }
}

export default MatchNews;
