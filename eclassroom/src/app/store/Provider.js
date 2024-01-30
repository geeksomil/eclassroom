"use client";

import { Provider } from "react-redux";
import { store } from "./store.js";
function ProviderComp({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
export default ProviderComp;
