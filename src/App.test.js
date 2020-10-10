import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('renders welcome element', () => {
	const { getByText } = render(<App />);
	const welcomeElement = getByText(/Welcome/i);
	expect(welcomeElement).toBeInTheDocument();
});

test('renders size controls', () => {
	const { getByText } = render(<App />);
	const addButton = getByText('+');
	const minusButton = getByText('-');
	expect(addButton).toBeInTheDocument();
	expect(minusButton).toBeInTheDocument();
});

test('renders initial grid size of 2 (4 tiles)', () => {
	const { container } = render(<App />);
	const tiles = container.querySelectorAll('.grass');
	expect(tiles).toHaveLength(4);
});

test('renders different size grid when size controls are clicked', () => {
	const { container } = render(<App />);
	fireEvent.click(screen.getByText('+'));
	const tiles = container.querySelectorAll('.grass');
	expect(tiles).toHaveLength(9);
});

test('render error message if no tiles are selected', () => {
	render(<App />);
	fireEvent.click(screen.getByText(/Show me the way/i));
	expect(screen.getByText(/Please select a starting and ending tile./i));
});

test('render start tile on first click', () => {
	const { container } = render(<App />);
	const firstTile = container.querySelector('.grass');
	fireEvent.click(firstTile);
	expect(firstTile).toHaveProperty('className', 'start');
});

test('render end tile on second click', () => {
	const { container } = render(<App />);
	const firstTile = container.querySelector('.grass');
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	expect(firstTile).toHaveProperty('className', 'end');
});

test('render impassable tile on third click', () => {
	const { container } = render(<App />);
	const firstTile = container.querySelector('.grass');
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	expect(firstTile).toHaveProperty('className', 'impassable');
});

test('render back to grass tile on fourth click', () => {
	const { container } = render(<App />);
	const firstTile = container.querySelector('.grass');
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	fireEvent.click(firstTile);
	expect(firstTile).toHaveProperty('className', 'grass');
});

test('render end tile on first click if start tile already defined', () => {
	const { container } = render(<App />);
	const tiles = container.querySelectorAll('.grass');
	fireEvent.click(tiles[0]);
	fireEvent.click(tiles[1]);
	expect(tiles[0]).toHaveProperty('className', 'start');
	expect(tiles[1]).toHaveProperty('className', 'end');
});
