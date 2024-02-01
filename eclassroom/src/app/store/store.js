import { configureStore } from "@reduxjs/toolkit";
import loginreducer from "./loginslice.js";
export const store = configureStore({
  reducer: loginreducer,
});
