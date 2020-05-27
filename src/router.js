import React, { Component } from 'react';
import {
 HashRouter, Route, Redirect, Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import Home from '@container/home';
import './styles/common/iconfont.css';
import configureStore from '@store/configureStore';
import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';
import intl from 'react-intl-universal';

const store = configureStore();

const lang = (navigator.languages && navigator.languages[0]) || navigator.language;
console.log(navigator, 'navigator');
intl.init({
  currentLocale: lang.split('-')[0],
  locales: {
    en: require('./locales/en_US.json'),
    zh: require('./locales/zh_CN.json')
  }
});
export default class App extends Component {
  render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <Provider store={store}>
          <HashRouter>
            <Switch>
              <Route path="/" exact render={() => (<Redirect to="/home" />)} />
              <Route path="/home" component={Home} />
            </Switch>
          </HashRouter>
        </Provider>
      </ConfigProvider>
    );
  }
}
