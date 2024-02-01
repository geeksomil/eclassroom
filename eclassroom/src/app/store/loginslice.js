const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  logins: {},
};
const loginslice = createSlice({
  name: "login",
  initialState,
  reducers: {
    addUsername: (state, action) => {
      const login = {
        username: action.payload,
      };
      state.logins = login;
    },
  },
});
export const { addUsername } = loginslice.actions;
export default loginslice.reducer;
