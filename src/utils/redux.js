export default (TYPES, initialState) => (state, action) => {
    const { type, payload } = action;
    if (Object.values(TYPES).includes(type)) return { ...state, ...payload };
    return state || initialState;
  };
