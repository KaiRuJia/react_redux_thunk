import React, { Component } from 'react';
// import { Button } from 'antd-mobile';
import { Steps, Button } from 'antd';
import { connect } from 'react-redux';
import { setName, setSex } from '@store/home/action.js';
import styles from './index.less';

const { Step } = Steps;

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const a = [
      { v: 2, c: 3 },
      { v: 4, d: 3 }
    ];
  }

  handleClick() {
    window.less.modifyVars(// 更换主题颜色要这么写
      {
        '@primary-color': '#1DA57A',
        '@btn-primary-bg': '#1DA57A'
      }
    ).then(() => {
      console.log('success');
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <div className={styles['major-fontColor']}>
          <Button onClick={this.handleClick} type="primary">更换</Button>
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
        <div className="aaa">aaa</div>
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
