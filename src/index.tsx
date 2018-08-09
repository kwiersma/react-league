import 'react-table/react-table.css'

import "bootstrap/dist/css/bootstrap-theme.css";
import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <App />,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
