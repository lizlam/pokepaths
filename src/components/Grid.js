import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: fit-content;
  border: 1px solid wheat;
  border-radius: 5px;
  padding: 2rem;
`;

function Grid({ size }) {
  const row = Array(size).fill({ type: "grass" });
  const grid = Array(size).fill(row);

  return (
    <StyledContainer>
      {grid.map((v, x) => {
        return (
          <div key={x}>
            {v.map((cell, y) => {
              return <button>{`(${x},${y})`}</button>;
            })}
          </div>
        );
      })}
    </StyledContainer>
  );
}

export default Grid;
