import React, { useState } from "react";
import styled from "styled-components";
import Grid from "./components/Grid";
import "./App.css";

const Container = styled.div`
  display: flex;
`;

const StyledInput = styled.input`
  width: 30px;
  font-size: 1rem;
  background: transparent;
  color: wheat;
  border: 1px solid wheat;
  border-radius: 5px;
  padding: 0.5rem;
`;

function App() {
  const [size, setSize] = useState(1);

  const handleDecrement = () => {
    size > 1 && setSize(size - 1);
  };

  const handleIncrement = () => {
    //TODO: Think about max size
    setSize(size + 1);
  };

  const handleChange = (e) => {
    setSize(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Pokepaths!</h1>
        <Container>
          <button onClick={handleDecrement}>-</button>
          <StyledInput type="number" value={size} onChange={handleChange} />
          <button onClick={handleIncrement}>+</button>
        </Container>
        <Grid size={size} />
      </header>
    </div>
  );
}

export default App;
