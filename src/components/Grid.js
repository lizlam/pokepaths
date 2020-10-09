import React, { useState, useRef } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: fit-content;
  border: 1px solid wheat;
  border-radius: 5px;
  padding: 2rem;
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

const StyledButton = styled.button`
  width: 20px;
  height: 20px;
`;

const Controls = styled.div`
  flex: display;
`;

function Grid() {
  const [size, setSize] = useState(1);
  const [impassable, setImpassable] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const row = Array(size).fill({ type: "grass" });
  const grid = Array(size).fill(row);

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

  const buttonRef = useRef();

  const handleClick = (e) => {
    const coord = e.target.value;
    const loc = e.target.value.split(',');
    //setStart({ "x": parseInt(loc[0]), "y": parseInt(loc[1]) });
    const current = buttonRef.current.children[parseInt(loc[0])].children[parseInt(loc[1])];
    const currentClass = current.className;

    switch (currentClass) {
      case "start":
        setStart(null);
        if (end === null) {
          setEnd(coord)
          current.className = "end";
        } else {
          setImpassable([...impassable, coord])
          current.className = "impassable";
        }
        break;
      case "end":
        setEnd(null);
        setImpassable([...impassable, coord])
        current.className = "impassable";
        break;
      case "impassable":
        const removed = impassable.filter(v => v === coord);
        setImpassable(removed)
        current.className = "grass";
        break;
      case "grass":
        if (start === null) {
          setStart(coord);
          current.className = "start";
          break;
        } else if (end === null) {
          setEnd(coord);
          current.className = "end";
          break
        } else {
          current.className = "impassable";
        }
        break;
      default:
        console.err("Something is wrong with this tile.")
    }
  }

  return (
    <>
      <Controls>
        Size
        <StyledButton onClick={handleDecrement}>-</StyledButton>
        <StyledInput type="number" value={size} onChange={handleChange} />
        <StyledButton onClick={handleIncrement}>+</StyledButton>
        Starting Square: {JSON.stringify(start)}
        Ending Square: {end}
        Impassable:{impassable.map((v, i) => <div key={i}>{v[i]}</div>)}
      </Controls>
      <StyledContainer ref={buttonRef}>
        {grid.map((v, x) => {
          return (
            <div key={x}>
              {v.map((cell, y) => {
                return (
                  <button
                    className="grass"
                    key={y}
                    value={[x, y]}
                    onClick={handleClick}
                  >
                    {`(${x},${y})`}
                  </button>
                )
              })}
            </div>
          );
        })}
      </StyledContainer>
    </>
  );
}

export default Grid;
