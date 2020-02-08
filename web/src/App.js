import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as Setting from "./Setting";

import {Switch, Route} from 'react-router-dom'
import TestPage from "./TestPage";
import DashboardPage from "./DashboardPage";
import {Badge, Button, Layout, Menu, Tag, Typography, Switch as AntdSwitch} from "antd";
import TracePage from "./TracePage";
import * as Backend from "./Backend";
import RulePage from "./RulePage";
import CanvasPage from "./CanvasPage";
import WebsitePage from "./WebsitePage";
import WebsiteEditPage from "./WebsiteEditPage";
import SessionPage from "./SessionPage";
import ImpressionPage from "./ImpressionPage";

const {Title, Paragraph, Text} = Typography;
const {Header, Footer, Sider, Content} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      status: true,
      sessionId: "",
      selectedMenuKey: 1,
      enablePlayerFastForward: true
    };

    Setting.initServerUrl();
  }

  getUrlPath() {
    // eslint-disable-next-line no-restricted-globals
    return location.pathname;
  }

  componentWillMount() {
    const path = this.getUrlPath();
    if (path.includes('dashboard')) {
      this.setState({selectedMenuKey: 2});
    } else if (path.includes('trace')) {
      this.setState({selectedMenuKey: 3});
    } else if (path.includes('canvas')) {
      this.setState({selectedMenuKey: 4});
    } else if (path.includes('rule')) {
      this.setState({selectedMenuKey: 5});
    } else if (path.includes('impressions')) {
      this.setState({selectedMenuKey: 8});
    } else if (path.includes('sessions')) {
      this.setState({selectedMenuKey: 7});
    } else if (path.includes('websites')) {
      this.setState({selectedMenuKey: 6});
    } else {
      this.setState({selectedMenuKey: 1});
    }

    Backend.getSessionId(Setting.getWebsiteId())
      .then(res => {
        this.setState({
          sessionId: res,
          status: true
        });
      })
      .catch(error => {
        this.setState({
          status: false
        });
      });
  }

  onSwitchChange(checked, e) {
    this.setState({
      enablePlayerFastForward: checked,
    });
    Setting.setEnablePlayerFastForward(checked);
  }

  render() {
    return (
      <div id="mouseArea" className={this.getUrlPath() === "/" ? "fill-window" : null}
        // React: https://reactjs.org/docs/events.html#mouse-events
        // MDN: https://developer.mozilla.org/en-US/docs/Web/Events
           onMouseMove={(e) => Setting.mouseHandler('mousemove', e)}
           onMouseDown={(e) => Setting.mouseHandler('mousedown', e)}
           onMouseUp={(e) => Setting.mouseHandler('mouseup', e)}
           onClick={(e) => Setting.mouseHandler('click', e)}
           onDoubleClick={(e) => Setting.mouseHandler('dblclick', e)}
           onContextMenu={(e) => Setting.mouseHandler('contextmenu', e)}
           onWheel={(e) => Setting.mouseHandler('wheel', e)}
           onTouchStart={(e) => Setting.mouseHandler('touchstart', e)}
           onTouchMove={(e) => Setting.mouseHandler('touchmove', e)}
           onTouchEnd={(e) => Setting.mouseHandler('touchend', e)}
      >
        <Layout className="layout">
          <Header style={{padding: '0', marginBottom: '3px'}}>
            <div className="logo"/>

            <Menu
              // theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
              style={{lineHeight: '64px'}}
              inlineCollapsed={false}
            >
              <Text>Mouselog</Text>

              <Menu.Item key="1">
                <a href="/">
                  Get Started
                </a>
              </Menu.Item>
              <Menu.Item key="6">
                <a href="/websites">
                  Websites
                </a>
              </Menu.Item>
              {
                !this.getUrlPath().includes('sessions') ? null :
                  <Menu.Item key="7">
                    <a href="#">
                      Sessions
                    </a>
                  </Menu.Item>
              }
              {
                !this.getUrlPath().includes('impressions') ? null :
                  <Menu.Item key="8">
                    <a href="#">
                      Impressions
                    </a>
                  </Menu.Item>
              }
              <Menu.Item key="2">
                <a href="/dashboard">
                  Dataset
                </a>
              </Menu.Item>
              {
                !this.getUrlPath().includes('trace') ? null :
                  <Menu.Item key="3">
                    <a href="#">
                      Trace
                    </a>
                  </Menu.Item>
              }
              {
                !this.getUrlPath().includes('canvas') ? null :
                  <Menu.Item key="4">
                    <a href="#">
                      Canvas
                    </a>
                  </Menu.Item>
              }
              <Menu.Item key="5">
                <a href="/rule">
                  Rule
                </a>
              </Menu.Item>
              <Menu.Item key='5' style={{float: 'right'}}>
                <a target="_blank" href="https://github.com/microsoft/mouselog">
                  <img alt="GitHub stars" src="https://img.shields.io/github/stars/microsoft/mouselog?style=social" />
                </a>
              </Menu.Item>
              {
                this.getUrlPath() !== "/" ? null :
                  <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Impression ID: &nbsp;
                    {<Tag color="#108ee9">{Setting.getImpressionId()}</Tag>}
                  </Text>
              }
              {
                this.getUrlPath() !== "/" ? null :
                  <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Session ID: &nbsp;
                    {<Tag color="#108ee9">{this.state.sessionId !== '' ? this.state.sessionId : 'NULL'}</Tag>}
                  </Text>
              }
              <Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Server Status: &nbsp;
                {this.state.status ? <Tag color="#87d068">On</Tag> : <Tag color="#f50">Off</Tag>}
              </Text>
              {/*<Text style={{float: 'right'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Player Fast Forward: &nbsp;*/}
              {/*  <AntdSwitch checked={this.state.enablePlayerFastForward} onChange={this.onSwitchChange.bind(this)}/>*/}
              {/*</Text>*/}
            </Menu>
          </Header>
        </Layout>

        <Switch>
          <Route exact path="/" component={TestPage}/>
          <Route path="/dashboard/" component={DashboardPage}/>
          <Route path="/trace/:sessionId" component={TracePage}/>
          <Route path="/canvas/:sessionId/:traceId" component={CanvasPage}/>
          <Route path="/rule/" component={RulePage}/>
          <Route exact path="/websites/" component={WebsitePage}/>
          <Route exact path="/websites/:websiteId" component={WebsiteEditPage}/>
          <Route exact path="/websites/:websiteId/sessions" component={SessionPage}/>
          <Route exact path="/websites/:websiteId/sessions/:sessionId/impressions" component={ImpressionPage}/>
          <Route exact path="/websites/:websiteId/sessions/:sessionId/impressions/:impressionId/events" component={CanvasPage}/>
        </Switch>
        {
          this.getUrlPath() === "/" ? null :
            <Footer style={
              {
                borderTop: '1px solid #e8e8e8',
                backgroundColor: 'white',
                textAlign: 'center',
              }
            }>
              Made with <span style={{color: 'rgb(255, 255, 255)'}}>❤️</span> by <a style={{fontWeight: "bold", color: "black"}} target="_blank" href="https://github.com/microsoft/mouselog">Microsoft</a>
            </Footer>
        }
      </div>
    );
  }

}

export default App;
