import axios from 'axios';

// import Storage from './storage';
// import Config from 'config';
import History from 'lib/history';

// import message from './message';

const Request = {};
Request.axios = axios;

const methods = [
  'get', 'post', 'put', 'delete', 'head', 'options', 'patch'
];
// const config = {

//   dev: {
//     baseURL: 'http://ssss:3000',
//     basename: '/'
//   },

//   prod: {
//     baseURL: 'http://1sss',
//     basename: '/webapp/'
//   }

// };

// module.exports = (env) => config[env || APP_ENV];


methods.forEach(m => {
  Request[m] = function(...args) {
    let token = Storage.get('token');
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const instance = axios.create({
      baseURL: Config().baseURL,
      timeout: 10000,
      cancelToken: source.token,
      headers: { token, 'Content-Type': 'application/json' }
    });
    instance.interceptors.response.use(res => {
      if (res.status == 500) {
        // server error
        message.error('请求失败，请重试!');
      } else if (res.data && res.data.code === 40001) {
        Storage.del('token');
        History.push('/login');
        message.error(res.data.msg || '请重新登录!');
      }
      return res.data;
    });

    return instance[m].apply(instance, args);
  }
});

export default Request;
