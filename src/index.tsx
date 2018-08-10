import "bootstrap/dist/css/bootstrap-theme.css";
import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <App />,
  document.getElementById("root") as HTMLElement,
);
registerServiceWorker();
