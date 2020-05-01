import * as React from "react";
import App from "./App";
import { render } from "@testing-library/react";

test("should render app", async () => {
  const { getByText } = render(<App />);

  const navbar = await getByText("Ghetto League");
  expect(navbar !== undefined);
});
