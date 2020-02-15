import Actor from "../../actors/Actor";

const initialState = {
	enemiesCount: 0,
	playersCount: 0,
	pause: false,
	actors: {}
};

interface State {
	pause: boolean;
	enemiesCount: number;
	playersCount: number;
	actors: Actors;
}

interface Actors {
	[id: string]: Actor;
}

interface Action {
	object: Actor;
	type: string;
}

export default function reducer<T>(state = initialState, action: Action): State {
	let newState: State = Object.assign({}, state);
	switch (action.type) {
	// case 'MOVE':
	// 	newState[action.object.id] = action.object;
	// 	return Object.assign({}, state, newState);
		case 'CREATE_ACTOR': 
			newState.actors[action.object.id] = action.object;
			if (action.object.type == 'player') {
				newState.playersCount = state.playersCount + 1;
			}
			if (action.object.type == 'enemy') {
				newState.enemiesCount = state.enemiesCount + 1;
			}
			return Object.assign({}, state, newState);
		case 'PAUSE':
			console.log(state);
			newState.pause = !state.pause;
			return Object.assign({}, state, newState);
		default:
			return state;
	}
}