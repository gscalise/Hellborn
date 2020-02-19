import Actor from "../../../actors/Actor";
import { Store } from "redux";
import Grid, { Quadrant } from "../../../physics/Grid";

export interface State {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	grid?: Grid;
	actors?: Actors;
}

interface Actors {
	[id: string]: Actor;
}

export interface Action {
	grid: Grid;
	actor: Actor;
	type: string;
	pause: boolean;
}

export interface customstore extends Store {
	getState: () => State;
}

const initialState = {
	pause: false,
	enemiesCount: 0,
	playersCount: 0,
	actors: {}
};

export default function reducer(state: State = initialState, action: Action): State {
	let newState: State = Object.assign({}, state);
	switch (action.type) {
		case 'MOVE_ACTOR':
			newState.grid = getNewGrid(newState.grid, action.actor);
			return Object.assign({}, state, newState);
		case 'ADD_ACTOR': 
			if (action.actor.type == 'player') {
				newState.playersCount = state.playersCount + 1;
			}
			if (action.actor.type == 'enemy') {
				newState.enemiesCount = state.enemiesCount + 1;
			}
			newState.actors[action.actor.id] = action.actor;

			const quadrantXIndex = parseInt(action.actor.currentQuadrants[0].charAt(0));
			const quadrantYIndex = parseInt(action.actor.currentQuadrants[0].charAt(1));
			const currentQuadrant = newState.grid.quadrants[quadrantXIndex][quadrantYIndex];
			newState.grid.quadrants[quadrantXIndex][quadrantYIndex] = Object.assign({}, addActorToQuadrant(currentQuadrant, action.actor, quadrantXIndex, quadrantYIndex));
			
			return Object.assign({}, state, newState);
		case 'ADD_GRID':
			newState.grid = action.grid;
			return Object.assign({}, state, newState);
		case 'PAUSE':
			newState.pause = action.pause;
			return Object.assign({}, state, newState);
		default:
			return state;
	}
}

function getNewGrid(grid: Grid, actor: Actor) {
	const newGrid = Object.assign({}, grid);
	for (let i = 0; i < actor.currentQuadrants.length; i++) {
		const quadrantXIndex = parseInt(actor.currentQuadrants[i].charAt(0));
		const quadrantYIndex = parseInt(actor.currentQuadrants[i].charAt(1));
		const currentQuadrant = newGrid.quadrants[quadrantXIndex][quadrantYIndex];
		if (actor.y + actor.hitBoxRadius <= currentQuadrant.y1 ||
				actor.y - actor.hitBoxRadius >= currentQuadrant.y2 ||
				actor.x + actor.hitBoxRadius <= currentQuadrant.x1 ||
				actor.x - actor.hitBoxRadius >= currentQuadrant.x2) {
			newGrid.quadrants[quadrantXIndex][quadrantYIndex] = removeActorFromQuadrant(currentQuadrant, actor, quadrantXIndex, quadrantYIndex);
		}
	}
	for (let i = 0; i < actor.currentQuadrants.length; i++) {
		const quadrantXIndex = parseInt(actor.currentQuadrants[i].charAt(0));
		const quadrantYIndex = parseInt(actor.currentQuadrants[i].charAt(1));
		const currentQuadrant = newGrid.quadrants[quadrantXIndex][quadrantYIndex];
		if (actor.x + actor.hitBoxRadius > currentQuadrant.x2) {
			const newQuadrantXIndex = quadrantXIndex + 1;
			const newQuadrant = newGrid.quadrants[newQuadrantXIndex][quadrantYIndex];
			newGrid.quadrants[newQuadrantXIndex][quadrantYIndex] = addActorToQuadrant(newQuadrant, actor, newQuadrantXIndex, quadrantYIndex);
		}
		if (actor.x - actor.hitBoxRadius < currentQuadrant.x1) {
			const newQuadrantXIndex = quadrantXIndex - 1;
			const newQuadrant = newGrid.quadrants[newQuadrantXIndex][quadrantYIndex];
			newGrid.quadrants[newQuadrantXIndex][quadrantYIndex] = addActorToQuadrant(newQuadrant, actor, newQuadrantXIndex, quadrantYIndex);
		}
		if (actor.y + actor.hitBoxRadius > currentQuadrant.y2) {
			const newQuadrantYIndex = quadrantYIndex + 1;
			const newQuadrant = newGrid.quadrants[quadrantXIndex][newQuadrantYIndex];
			newGrid.quadrants[quadrantXIndex][newQuadrantYIndex] = addActorToQuadrant(newQuadrant, actor, quadrantXIndex, newQuadrantYIndex);
		}
		if (actor.y - actor.hitBoxRadius < currentQuadrant.y1) {			
			const newQuadrantYIndex = quadrantYIndex - 1;
			const newQuadrant = newGrid.quadrants[quadrantXIndex][newQuadrantYIndex];
			newGrid.quadrants[quadrantXIndex][newQuadrantYIndex] = addActorToQuadrant(newQuadrant, actor, quadrantXIndex, newQuadrantYIndex);
		}
	}
	return newGrid;
}

function removeActorFromQuadrant(quadrant: Quadrant, actor: Actor, xIndex: number, yIndex: number) {
	const newQuadrant = Object.assign({}, quadrant);
	if (newQuadrant.activeActors.indexOf(actor.id) > -1) {
		newQuadrant.activeActors.splice( newQuadrant.activeActors.indexOf(actor.id), 1);
	}
	if (actor.currentQuadrants.indexOf(`${xIndex}${yIndex}`) > -1) {
		actor.currentQuadrants.splice(actor.currentQuadrants.indexOf(`${xIndex}${yIndex}`), 1);
	}
	return newQuadrant;
}

function addActorToQuadrant(quadrant: Quadrant, actor: Actor, xIndex: number, yIndex: number) {
	const newQuadrant = Object.assign({}, quadrant);
	if (newQuadrant.activeActors.indexOf(actor.id) == -1) {
		newQuadrant.activeActors.push(actor.id);
	}
	if (actor.currentQuadrants.indexOf(`${xIndex}${yIndex}`) == -1) {
		actor.currentQuadrants.push(`${xIndex}${yIndex}`);
	}
	return newQuadrant;
}