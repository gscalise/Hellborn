import Actor from "../../../actors/Actor";
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

// export interface customstore extends Store {
// 	getState: () => State;
// }

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
			const currentQuadrantIndex = action.actor.currentQuadrants[0];
			const currentQuadrant = newState.grid.quadrants[currentQuadrantIndex.xIndex][currentQuadrantIndex.yIndex];
			addActorToQuadrant(currentQuadrant, action.actor, currentQuadrantIndex.xIndex, currentQuadrantIndex.yIndex);

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
	for (let i = 0; i < actor.currentQuadrants.length; i++) {
		for (let i = 0; i < actor.currentQuadrants.length; i++) {
			const currentQuadrantIndex = actor.currentQuadrants[i];
			const currentQuadrant = grid.quadrants[currentQuadrantIndex.xIndex][currentQuadrantIndex.yIndex];
			if (actor.y + actor.hitBoxRadius <= currentQuadrant.y1 ||
					actor.y - actor.hitBoxRadius >= currentQuadrant.y2 ||
					actor.x + actor.hitBoxRadius <= currentQuadrant.x1 ||
					actor.x - actor.hitBoxRadius >= currentQuadrant.x2) {
						grid.quadrants[currentQuadrantIndex.xIndex][currentQuadrantIndex.yIndex] = removeActorFromQuadrant(currentQuadrant, actor, currentQuadrantIndex.xIndex, currentQuadrantIndex.yIndex);
			}
		}
		const currentQuadrantIndex = actor.currentQuadrants[i];
		const currentQuadrant = grid.quadrants[currentQuadrantIndex.xIndex][currentQuadrantIndex.yIndex];
		if (actor.x + actor.hitBoxRadius > currentQuadrant.x2) {
			const newQuadrantXIndex = currentQuadrantIndex.xIndex + 1;
			const newQuadrant = grid.quadrants[newQuadrantXIndex][currentQuadrantIndex.yIndex];
			grid.quadrants[newQuadrantXIndex][currentQuadrantIndex.yIndex] = addActorToQuadrant(newQuadrant, actor, newQuadrantXIndex, currentQuadrantIndex.yIndex);
		}
		if (actor.x - actor.hitBoxRadius < currentQuadrant.x1) {
			const newQuadrantXIndex = currentQuadrantIndex.xIndex - 1;
			const newQuadrant = grid.quadrants[newQuadrantXIndex][currentQuadrantIndex.yIndex];
			grid.quadrants[newQuadrantXIndex][currentQuadrantIndex.yIndex] = addActorToQuadrant(newQuadrant, actor, newQuadrantXIndex, currentQuadrantIndex.yIndex);
		}
		if (actor.y + actor.hitBoxRadius > currentQuadrant.y2) {
			const newQuadrantYIndex = currentQuadrantIndex.yIndex + 1;
			const newQuadrant = grid.quadrants[currentQuadrantIndex.xIndex][newQuadrantYIndex];
			grid.quadrants[currentQuadrantIndex.xIndex][newQuadrantYIndex] = addActorToQuadrant(newQuadrant, actor, currentQuadrantIndex.xIndex, newQuadrantYIndex);
		}
		if (actor.y - actor.hitBoxRadius < currentQuadrant.y1) {			
			const newQuadrantYIndex = currentQuadrantIndex.yIndex - 1;
			const newQuadrant = grid.quadrants[currentQuadrantIndex.xIndex][newQuadrantYIndex];
			grid.quadrants[currentQuadrantIndex.xIndex][newQuadrantYIndex] = addActorToQuadrant(newQuadrant, actor, currentQuadrantIndex.xIndex, newQuadrantYIndex);
		}
	}
	return grid;
}

function removeActorFromQuadrant(quadrant: Quadrant, actor: Actor, x: number, y: number) {
	if (quadrant.activeActors.indexOf(actor.id) > -1) {
		quadrant.activeActors.splice( quadrant.activeActors.indexOf(actor.id), 1);
	}
	if (actor.currentQuadrants.indexOf({xIndex: x, yIndex: y}) > -1) {
		actor.currentQuadrants.splice(actor.currentQuadrants.indexOf({xIndex: x, yIndex: y}), 1);
	}
	return quadrant;
}

function addActorToQuadrant(quadrant: Quadrant, actor: Actor, x: number, y: number) {
	if (quadrant.activeActors.indexOf(actor.id) == -1) {
		quadrant.activeActors.push(actor.id);
	}
	if (actor.currentQuadrants.findIndex((quadrantIndex) => {quadrantIndex.xIndex == x && quadrantIndex.yIndex == y;}) == -1) {
		actor.currentQuadrants.push({xIndex: x, yIndex: y});
	}
	return quadrant;
}