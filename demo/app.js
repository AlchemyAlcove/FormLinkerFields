import React from "react";
import Style from "./app.style";
import { render } from "react-dom";
import { injectGlobal, ThemeProvider } from "styled-components";

injectGlobal`
  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
`;

class App extends React.Component {
  render() {
    return(
      <ThemeProvider theme={{colors: []}}>
        <Style className="demo-form">
          <div>Form Linker Fields</div>
        </Style>
      </ThemeProvider>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  render(
    <App/>,
    document.getElementById("demo")
  );
});
