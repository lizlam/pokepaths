import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { getPath, getXY } from '../utils/Utils';

const StyledContainer = styled.div`
	width: fit-content;
	border: 1px solid wheat;
	border-radius: 5px;
	padding: 2rem;
	min-width: 900px;
	min-height: 300px;
`;

const StyledInput = styled.input`
	width: 30px;
	font-size: 1.5rem;
	background: transparent;
	color: wheat;
	border: 1px solid wheat;
	border-radius: 5px;
	padding: 0.5rem;
`;

const StyledButton = styled.button`
	width: 40px;
	height: 64px;
	background: transparent;
	border: 1px solid wheat;
	color: wheat;
	font-size: 1.6rem;
	border-radius: 8px;
	margin: 1rem;
	&:hover {
		border: 2px solid wheat;
	}
`;

const ShowButton = styled(StyledButton)`
  width: 300px;
  font-size: 1.5rem;
  transition: font-size .3s linear;
  &:hover {
    font-size: 1.6rem;
  }
`;

const Controls = styled.div`
	display: grid;
	grid-template-rows: 1fr 1fr;
`;

const StyledError = styled.div`
	border: 1px solid red;
	color: red;
	border-radius: 5px;
	padding: 0.5rem;
	margin-top: 1rem;
`;

const StyledMessage = styled(StyledError)`
border: 1px solid corral;
`;

function Grid() {
	const [ size, setSize ] = useState(2);
	const [ impassable, setImpassable ] = useState([]);
	const [ start, setStart ] = useState(null);
	const [ end, setEnd ] = useState(null);
	const [ path, setPath ] = useState([]);
	const [ errorMessage, setErrorMessage ] = useState();
	const [ loading, setLoading ] = useState(false);
	const row = Array(size).fill({ type: 'grass' });
	const grid = Array(size).fill(row);
	const buttonRef = useRef();

	const handleDecrement = () => {
		size > 1 && setSize(size - 1);
	};

	const handleIncrement = () => {
		//TODO: Think about max size
		setSize(size + 1);
	};

	const handleChange = (e) => {
		if (e.target.value) {
			let input = parseInt(e.target.value);
			setSize(input);
		}
	};

	const reset = () => {
		if (start !== null) {
			const startRef = getTileRef(start[0], start[1]);
			startRef.className = 'grass';
			setStart(null);
		}
		if (end !== null) {
			const endRef = getTileRef(end[0], end[1]);
			endRef.className = 'grass';
			setEnd(null);
		}
		if (impassable !== []) {
			impassable.map((tile) => {
				const rockRef = getTileRef(tile[0], tile[1]);
				rockRef.className = 'grass';
			});
			setImpassable([]);
		}
		if (path !== []) {
			path.map((tile) => {
				const pathRef = getTileRef(tile[0], tile[1]);
				pathRef.className = 'grass';
			});
		}
	};

	const getPathTiles = (startPoint, entries) => {
		let pathTiles = [];
		const expectedEnd = entries.reduce(function(result, entry) {
			pathTiles.push(result);
			return [ parseInt(result[0]) + entry[0], parseInt(result[1]) + entry[1] ];
		}, startPoint);
		pathTiles.shift(); // first entry is repeated, so remove
		return [ pathTiles, expectedEnd ];
	};

	const highlightPath = (tiles) => {
		tiles.map((v) => {
			const current = getTileRef(v[0], v[1]);
			current.className = 'path';
		});
	};

	const validate = () => {
		if (start && end !== null) {
			return true;
		} else {
			return false;
		}
	};

	const getPathHandler = () => {
		if (!validate()) {
			setErrorMessage('Please select a starting and ending tile.');
			return;
		}
		setLoading(true);
		const node = start;
		const rocks = impassable.map((v) => getXY(v));
		const promise = getPath(size, getXY(start), getXY(end), rocks);
		promise
			.then((res) => {
				const addends = res.moves.map((direction) => {
					let x = parseInt(node[0]);
					let y = parseInt(node[1]);
					switch (direction) {
						case 'D':
							y = 1;
							x = 0;
							break;
						case 'U':
							y = -1;
							x = 0;
							break;
						case 'R':
							x = 1;
							y = 0;
							break;
						case 'L':
							x = -1;
							y = 0;
							break;
						default:
							console.error('There are no other directions in this dimension.');
					}
					return [ x, y ];
				});
				const [ pathTiles ] = getPathTiles(node, addends);
				setPath(pathTiles);
				highlightPath(pathTiles);
			})
			.catch(() => setErrorMessage('Unable to find a proper path.'));
		setLoading(false);
	};

	const getTileRef = (x, y) => {
		return buttonRef.current.children[parseInt(y)].children[parseInt(x)];
	};

	const handleClick = (e) => {
		setErrorMessage(null);
		const loc = e.target.value.split(',');
		const x = loc[0];
		const y = loc[1];
		const coord = [ x, y ];
		const current = getTileRef(x, y);
		const currentClass = current.className;

		switch (currentClass) {
			case 'start':
				setStart(null);
				if (end === null) {
					setEnd(coord);
					current.className = 'end';
				} else {
					setImpassable([ ...impassable, coord ]);
					current.className = 'impassable';
				}
				break;
			case 'end':
				setEnd(null);
				setImpassable([ ...impassable, coord ]);
				current.className = 'impassable';
				break;
			case 'impassable':
				const removed = impassable.filter((v) => v === coord);
				setImpassable(removed);
				current.className = 'grass';
				break;
			case 'grass':
				if (start === null) {
					setStart(coord);
					current.className = 'start';
					break;
				} else if (end === null) {
					setEnd(coord);
					current.className = 'end';
					break;
				} else {
					current.className = 'impassable';
					setImpassable([ ...impassable, coord ]);
				}
				break;
			default:
				console.error('Something is wrong with this tile.');
		}
	};

	return (
		<div>
			<Controls>
				<div>
					<StyledButton onClick={handleDecrement}>-</StyledButton>
					<StyledInput type="number" value={size} onChange={handleChange} />
					<StyledButton onClick={handleIncrement}>+</StyledButton>
				</div>
				<div>
					<ShowButton id="getpath" onClick={getPathHandler}>
						Show me the way!
					</ShowButton>
					<ShowButton id="reset" onClick={reset}>
						Reset
					</ShowButton>
				</div>
			</Controls>
			<StyledContainer ref={buttonRef}>
				{grid.map((v, y) => {
					return (
						<div key={y}>
							{v.map((cell, x) => {
								return <button className="grass" key={x} value={[ x, y ]} onClick={handleClick} />;
							})}
						</div>
					);
				})}
			</StyledContainer>
			{errorMessage && <StyledError>{errorMessage}</StyledError>}
			{loading && <StyledMessage>Loading...</StyledMessage>}
		</div>
	);
}

export default Grid;
