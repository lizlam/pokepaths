import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getPath, getXY } from "../utils/Utils";
import { isCompositeComponent } from "react-dom/test-utils";

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
  const [size, setSize] = useState(0);
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
    let input = parseInt(e.target.value);
    setSize(input);
  };

  const getPathTiles = (startPoint, entries) => {
    let pathTiles = [];
    const expectedEnd = entries.reduce(function (result, entry) {
      pathTiles.push(result);
      return [parseInt(result[0]) + entry[0], parseInt(result[1]) + entry[1]]
    }, startPoint)
    pathTiles.shift(); // first entry is repeated, so remove
    return [pathTiles, expectedEnd]
  }

  const highlightPath = (tiles) => {
    tiles.map((v) => {
      console.log(v);
      const current = getTileRef(v[0], v[1]);
      current.className = "path";
    })
  }

  const getPathHandler = () => {
    const node = start.split(',');
    const rocks = impassable.map(v => getXY(v));
    const promise = getPath(size, getXY(start), getXY(end), rocks);
    promise.then(res => {
      const addends = res.moves.map(direction => {
        let x = parseInt(node[0]);
        let y = parseInt(node[1]);
        switch (direction) {
          case "D":
            y = 1;
            x = 0;
            break;
          case "U":
            y = -1;
            x = 0;
            break;
          case "R":
            x = 1;
            y = 0;
            break;
          case "L":
            x = -1;
            y = 0;
            break;
          default:
            console.error("There are no other directions in this dimension.");
        }
        return [x, y]
      })
      const [pathTiles] = getPathTiles(node, addends);
      highlightPath(pathTiles);
    });
  }

  const buttonRef = useRef();

  const getTileRef = (x, y) => {
    return buttonRef.current.children[parseInt(y)].children[parseInt(x)];
  }

  const handleClick = (e) => {
    const coord = e.target.value;
    // Get the individual (x,y) coordinates
    const loc = e.target.value.split(',');
    const x = loc[0];
    const y = loc[1];
    const current = getTileRef(x, y);
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
          setImpassable([...impassable, coord]);
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
        <button onClick={getPathHandler}>Show me the way!</button>
      </Controls>
      <StyledContainer ref={buttonRef}>
        {grid.map((v, y) => {
          return (
            <div key={y}>
              {v.map((cell, x) => {
                return (
                  <button
                    className="grass"
                    key={x}
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
