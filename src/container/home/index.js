import React, { Component } from 'react';
// import { Button } from 'antd-mobile';
import { Steps, Button, DatePicker } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { setName, setSex } from '@store/home/action.js';
import './index.less';

const { Step } = Steps;
const { RangePicker } = DatePicker;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themes: process.env.themes,
      currentLink: null
    };
  }

  componentDidMount() {
    const a = [
      { v: 2, c: 3 },
      { v: 4, d: 3 }
    ];
  }

  remove = (el) => el && el.parentNode.removeChild(el)

  changeTheme = (theme) => {
    const { currentLink } = this.state;
    if (theme === (currentLink && currentLink.dataset.theme)) {
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${theme}.css`;
    link.dataset.theme = theme;
    document.head.appendChild(link);
    link.onload = () => {
      this.removeTheme();
      this.setState({
        currentLink: link
      });
    };
  }

  removeTheme = () => {
    const { currentLink } = this.state;
    this.remove(currentLink);
  }

  resetTheme = () => {
    this.removeTheme();
    this.setState({
      currentLink: null
    });
  }


  render() {
    const { themes } = this.state;
    console.log(themes, 'themes');
    return (
      <div styleName="major-fontColor">
        {/* <div styleName="major-fontColor">
          <Button onClick={this.handleClick} type="primary">更换</Button>
        </div> */}
        <div>
          <h1>点击按钮切换主题</h1>
          <button onClick={this.resetTheme}>default</button>
          {
          themes.map((theme) => (
            <button key={theme} onClick={() => this.changeTheme(theme)}>{theme}</button>
          ))
        }
        </div>
        <p className="test">测试环境</p>
        <p>
          姓名：
          {this.props.name}
        </p>
        <p>
          性别：
          <span className="iconfont iconhanbaobao" />
          {this.props.sex}
        </p>
        <div styleName="aaa">aaa</div>
        <div>
          测试国际化：
          {intl.get('Userpanel')}
        </div>
        <RangePicker style={{ width: 200 }} />
        <div>
          <Button type="primary" onClick={() => this.props.dispatch(setName('里斯'))}>改变姓名</Button>
        </div>
        <Button type="primary" onClick={() => this.props.dispatch(setSex(2000))}>改变性别</Button>
        <Steps current={1}>
          <Step title="Finished" description="This is a description." />
          <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
          <Step title="Waiting" description="This is a description." />
        </Steps>
        <div>icon</div>
        <span className="iconfont iconlajiao" />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { name, sex } = state.home;
  return { name, sex };
};

export default connect(mapStateToProps)(Home);
