import * as React from "react";
import App from "./App";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

test("should render app", async () => {
  const { getByText } = render(<BrowserRouter><App /></BrowserRouter>);

  const navbar = getByText("Ghetto League 2024");
  expect(navbar).toBeInTheDocument();
});
