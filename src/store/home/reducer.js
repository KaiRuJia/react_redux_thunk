import reducerCreator from '@utils/redux';
import actions from './const';

const initialState = {
  name: '章三',
  sex: '男'
};

export default reducerCreator(actions, initialState);
