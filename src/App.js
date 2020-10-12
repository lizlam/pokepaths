import React from 'react';
import styled from 'styled-components';
import Grid from './components/Grid';
import './App.css';

const StyledContainer = styled.div`
	width: fit-content;
	border: 1px solid wheat;
	border-radius: 5px;
	padding: 2rem;
	min-width: 900px;
	min-height: 75%;
`;

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Welcome to Pokepaths!</h1>
				<StyledContainer>
					<Grid />
				</StyledContainer>
			</header>
		</div>
	);
}
export default App;
