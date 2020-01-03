import React,{ Component } from 'react'
import { HashRouter ,Route,Redirect,Switch } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from "@redux/store";
import Home from '@pages/home';

export default class App extends Component {
  render() {
    return (
    <Provider store={store}>
      <HashRouter>
      <Switch>
        <Route path="/" exact render={()=>(<Redirect to="/home"/>)}/>
        <Route path="/home" component={Home}/>
      </Switch>
      </HashRouter>
    </Provider>
    )
  }
}
