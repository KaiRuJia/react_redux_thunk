import actions from '../const';

const initialState = {
  name: '章三',
  sex: '男'
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_NAME:
      return {
        ...state,
        name: action.payload.name
      };
    case actions.SET_SEX:
      return {
        ...state,
        sex: action.payload.sex
      };
    default:
      return initialState;
  }
};
