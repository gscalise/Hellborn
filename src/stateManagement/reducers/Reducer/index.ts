import Actor from "../../../actors/Actor";
import { Store } from "redux";
import Grid from "../../../physics/Grid";

export interface State {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	grid: Grid|unknown;
	actors: Actors;
}

export interface Actors {
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
	grid: 0,
	actors: {}
};

export default function reducer(state: State = initialState, action: Action): State {
	let newState: State = Object.assign({}, state);
	switch (action.type) {
	// case 'MOVE_ACTOR':
	// 	newState[action.object.id] = action.object;
	// 	return Object.assign({}, state, newState);
		case 'ADD_ACTOR': 
			if (action.actor.type == 'player') {
				newState.playersCount = state.playersCount + 1;
			}
			if (action.actor.type == 'enemy') {
				newState.enemiesCount = state.enemiesCount + 1;
			}
			newState.actors[action.actor.id] = action.actor;
			return Object.assign({}, state, newState);
		case 'ADD_GRID':
			newState.grid = action.pause;
			return Object.assign({}, state, newState);
		case 'PAUSE':
			newState.pause = action.pause;
			return Object.assign({}, state, newState);
		default:
			return state;
	}
}