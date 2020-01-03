import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { setName, setSex } from '@redux/action/home.js';
import Style from './style.less';

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

  render() {
    return (
      <div className={Style.home}>
        <p>测试环境</p>
        <p>
姓名：
          {this.props.name}
        </p>
        <p>
性别：
          {this.props.sex}
        </p>
        <Button onClick={() => this.props.dispatch(setName('里斯'))}>改变姓名</Button>
        <Button onClick={() => this.props.dispatch(setSex(2000))}>改变性别</Button>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { name, sex } = state.home;
  return { name, sex };
};

export default connect(mapStateToProps)(Home);
