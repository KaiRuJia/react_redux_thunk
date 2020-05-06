import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'; // 查看Redux 中状态变化
import thunk from 'redux-thunk';
import reducer from './reducer';

export default () => {
  const logger = createLogger({
    duration: 1000,
    predicate: true, /** 判断日志打印条件如：生产环境 */
    stateTransformer: (state) => {
      const result = {};
      Object.keys(state).filter((key) => {
        if (state[key].toJS) {
          result[key] = state[key].toJS();
        } else {
          result[key] = state[key];
        }
      });
    }
  });
  const middlewares = [thunk, logger];
  const enhancers = applyMiddleware(...middlewares);
  const composedEnhancers = composeWithDevTools(...[enhancers]);
  const store = createStore(reducer, composedEnhancers);
  return store;
};
