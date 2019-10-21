import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore,applyMiddleware } from 'redux';
import reducers from "../reduces";

export default createStore(
  reducers,
  applyMiddleware(thunk,createLogger({
    duration:1000,
    predicate:true,/**判断日志打印条件如：生产环境*/
    stateTransformer:(state) => {
      var result = {}
      Object.keys(state).filter( key => {
        if(state[key].toJS) {
          result[key] = state[key].toJS()
        } else {
          result[key] = state[key]
        }
      })
    }
  }))
)