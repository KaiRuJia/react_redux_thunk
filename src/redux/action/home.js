import actions from '../const'

export const setName = (data) => {
  return dispatch => {
    dispatch({
      type:actions.SET_NAME,
      payload:{
        name:data
      }
    })
  }
}
export const setSex = (data) => {
  return dispatch => {
    dispatch({
      type:actions.SET_SEX,
      payload:{
        sex:data
      }
    })
  }
}