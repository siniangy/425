import React, { Component } from 'react';

class Iframe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUrl: ''
        }
    }
    componentDidMount() { this.getCurrentUrl(this.props.currentUrl) }
    componentWillMount() { }
    componentWillReceiveProps(nextProps) {
        if (this.props.currentUrl !== nextProps.currentUrl) {
            if (nextProps.currentUrl) {
                this.getCurrentUrl(nextProps.currentUrl)
            }
        }
    }
    getCurrentUrl(url) {
        this.setState({
            currentUrl: url
        }, () => {
            // console.log(this.state.currentUrl)
            this.handleIndex(this.state.currentUrl)
        })
    }
    handleIndex(index) {
        // 渲染之后才可以传参，第一次渲染拿不到！！
        const iframeObj = document.getElementById('iframe');
        iframeObj.contentWindow.postMessage(index, '*')
    }
    render() {
        return (
            <div>
                <iframe
                    style={{ width: "100%", border: "0px", height: "500px" }}
                    sandbox="allow-scripts allow-forms allow-same-origin"
                    scrolling="auto"
                    id="iframe"
                    src='/iframe/lunbo.html'
                />
            </div>
        );
    }
}

export default Iframe;