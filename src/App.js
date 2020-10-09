import React, { useState } from "react";
import styled from "styled-components";
import Grid from "./components/Grid";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Pokepaths!</h1>
        <Grid />
      </header>
    </div>
  );
}
export default App;
